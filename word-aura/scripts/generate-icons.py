#!/usr/bin/env python3
"""Renders the app icons from the same geometry as public/icon.svg.

The sandbox has no SVG rasteriser, so the shape is redrawn with Pillow at 4x
and downsampled. Run: python3 scripts/generate-icons.py
"""
from pathlib import Path

from PIL import Image, ImageDraw

OUT = Path(__file__).resolve().parent.parent / "public"
ACCENT = (75, 68, 214, 255)
SPARK = (207, 202, 255, 255)
SS = 4  # supersampling factor


def rounded_icon(size: int, content_scale: float = 1.0) -> Image.Image:
    """Draw the icon at `size` with the artwork scaled inside the tile."""
    canvas = size * SS
    image = Image.new("RGBA", (canvas, canvas), (0, 0, 0, 0))
    draw = ImageDraw.Draw(image)

    draw.rounded_rectangle([0, 0, canvas - 1, canvas - 1], radius=int(116 / 512 * canvas), fill=ACCENT)

    # Inner ring, as in the SVG.
    ring = Image.new("RGBA", (canvas, canvas), (0, 0, 0, 0))
    ring_draw = ImageDraw.Draw(ring)
    r = 178 / 512 * canvas
    c = canvas / 2
    ring_draw.ellipse([c - r, c - r, c + r, c + r], outline=(255, 255, 255, 36), width=max(1, int(2 / 512 * canvas)))
    image = Image.alpha_composite(image, ring)
    draw = ImageDraw.Draw(image)

    # Artwork geometry in the 512 viewBox, scaled about the centre.
    scale = canvas / 512 * content_scale
    offset = (canvas - canvas * content_scale) / 2

    def point(x: float, y: float) -> tuple[float, float]:
        return (x * scale + offset, y * scale + offset)

    w_points = [point(168, 170), point(212, 332), point(256, 238), point(300, 332), point(344, 170)]
    stroke = int(30 / 512 * canvas * content_scale)
    draw.line(w_points, fill=(255, 255, 255, 255), width=stroke, joint="curve")
    for x, y in w_points:
        draw.ellipse([x - stroke / 2, y - stroke / 2, x + stroke / 2, y + stroke / 2], fill=(255, 255, 255, 255))

    spark = [point(400, 96), point(410, 112), point(400, 128), point(390, 112)]
    draw.polygon(spark, fill=SPARK)

    return image.resize((size, size), Image.LANCZOS)


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    rounded_icon(192).save(OUT / "icon-192.png")
    rounded_icon(512).save(OUT / "icon-512.png")

    # Maskable icon: Android may crop to a circle, so keep the artwork inside
    # the 80% safe zone.
    maskable = rounded_icon(512, content_scale=0.78)
    maskable.save(OUT / "icon-maskable-512.png")

    print("wrote icon-192.png, icon-512.png, icon-maskable-512.png")


if __name__ == "__main__":
    main()
