#!/usr/bin/env python3
"""Generates the Android launcher icons and splash screens for Word Aura.

Run after `npx cap add android` (or any time the brand mark changes):
    python3 scripts/generate-android-assets.py
"""
from pathlib import Path

from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parent.parent / "android/app/src/main/res"
ACCENT = (75, 68, 214, 255)
SPARK = (207, 202, 255, 255)
BG = (245, 244, 240, 255)
SS = 4

DENSITIES = {
    "mdpi": 48,
    "hdpi": 72,
    "xhdpi": 96,
    "xxhdpi": 144,
    "xxxhdpi": 192,
}
FOREGROUND = {"mdpi": 108, "hdpi": 162, "xhdpi": 216, "xxhdpi": 324, "xxxhdpi": 432}
SPLASH = {
    "drawable": (480, 320),
    "drawable-port-mdpi": (320, 480),
    "drawable-port-hdpi": (480, 800),
    "drawable-port-xhdpi": (720, 1280),
    "drawable-port-xxhdpi": (960, 1600),
    "drawable-port-xxxhdpi": (1280, 1920),
    "drawable-land-mdpi": (480, 320),
    "drawable-land-hdpi": (800, 480),
    "drawable-land-xhdpi": (1280, 720),
    "drawable-land-xxhdpi": (1600, 960),
    "drawable-land-xxxhdpi": (1920, 1280),
}


def draw_mark(draw: ImageDraw.ImageDraw, size: int, scale: float, offset: float = 0.0) -> None:
    """Draws the W + spark from the 512-unit design grid onto a `size` box."""

    def point(x: float, y: float) -> tuple[float, float]:
        return (x / 512 * size * scale + offset, y / 512 * size * scale + offset)

    stroke = max(2, int(30 / 512 * size * scale))
    w_points = [point(168, 170), point(212, 332), point(256, 238), point(300, 332), point(344, 170)]
    draw.line(w_points, fill=(255, 255, 255, 255), width=stroke, joint="curve")
    for x, y in w_points:
        draw.ellipse([x - stroke / 2, y - stroke / 2, x + stroke / 2, y + stroke / 2], fill=(255, 255, 255, 255))
    draw.polygon(
        [point(400, 96), point(410, 112), point(400, 128), point(390, 112)],
        fill=SPARK,
    )


def icon(size: int, *, round_shape: bool = False, transparent: bool = False,
         artwork_scale: float = 1.0) -> Image.Image:
    canvas = size * SS
    image = Image.new("RGBA", (canvas, canvas), (0, 0, 0, 0))
    draw = ImageDraw.Draw(image)

    if not transparent:
        if round_shape:
            draw.ellipse([0, 0, canvas - 1, canvas - 1], fill=ACCENT)
        else:
            draw.rounded_rectangle([0, 0, canvas - 1, canvas - 1], radius=int(116 / 512 * canvas), fill=ACCENT)

    if transparent:
        offset = (canvas - canvas * artwork_scale) / 2
        draw_mark(draw, canvas, artwork_scale, offset)
    else:
        draw_mark(draw, canvas, 1.0)

    return image.resize((size, size), Image.LANCZOS)


def main() -> None:
    for density, size in DENSITIES.items():
        folder = ROOT / f"mipmap-{density}"
        folder.mkdir(parents=True, exist_ok=True)
        icon(size).save(folder / "ic_launcher.png")
        icon(size, round_shape=True).save(folder / "ic_launcher_round.png")

    for density, size in FOREGROUND.items():
        folder = ROOT / f"mipmap-{density}"
        folder.mkdir(parents=True, exist_ok=True)
        # Adaptive foregrounds are 108dp with a 72dp safe zone, so the mark is
        # drawn inside the middle ~60% and left transparent elsewhere.
        icon(size, transparent=True, artwork_scale=1.18).save(folder / "ic_launcher_foreground.png")

    for folder_name, (width, height) in SPLASH.items():
        folder = ROOT / folder_name
        folder.mkdir(parents=True, exist_ok=True)
        canvas = Image.new("RGBA", (width, height), BG)
        logo_size = int(min(width, height) * 0.22)
        logo = icon(logo_size * SS).resize((logo_size, logo_size), Image.LANCZOS)
        canvas.alpha_composite(logo, ((width - logo_size) // 2, (height - logo_size) // 2))
        canvas.convert("RGB").save(folder / "splash.png")

    print("wrote launcher icons, adaptive foregrounds and splash screens")


if __name__ == "__main__":
    main()
