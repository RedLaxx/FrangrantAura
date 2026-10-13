"use client";

import Image from "next/image";
import { useState } from "react";

interface ProductImageProps {
  src: string;
  alt: string;
  /** Tailwind sizes prop for next/image. */
  sizes?: string;
  priority?: boolean;
  className?: string;
  /** Wrapper class — useful for aspect-ratio control. */
  wrapperClassName?: string;
  accent?: string;
}

/**
 * Product photography with a graceful fallback.
 *
 * If an image file is missing (for example while you are still swapping the
 * sample photography for your own), the card degrades to a branded gradient
 * panel instead of a broken image icon.
 */
export default function ProductImage({
  src,
  alt,
  sizes = "(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 300px",
  priority = false,
  className = "object-cover",
  wrapperClassName = "",
  accent = "#d0ac4c",
}: ProductImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        className={`flex items-center justify-center ${wrapperClassName}`}
        style={{
          background: `radial-gradient(120% 100% at 50% 0%, ${accent}22 0%, transparent 60%), linear-gradient(160deg, #14141a 0%, #0a0a0d 100%)`,
        }}
        aria-label={alt}
        role="img"
      >
        <span className="px-6 text-center font-display text-2xl leading-snug text-white/25">
          {alt}
        </span>
      </div>
    );
  }

  return (
    <div className={wrapperClassName}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className={className}
        onError={() => setFailed(true)}
      />
    </div>
  );
}
