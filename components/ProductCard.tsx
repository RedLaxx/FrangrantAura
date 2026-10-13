import Link from "next/link";
import ProductImage from "./ProductImage";
import AddToCartButton from "./AddToCartButton";
import StarRating from "./StarRating";
import { formatPrice, discountPercent } from "@/lib/format";
import { getBrandBySlug } from "@/lib/products";
import type { Product } from "@/lib/types";

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export default function ProductCard({
  product,
  priority = false,
}: ProductCardProps) {
  const brand = getBrandBySlug(product.brandSlug);
  const discount = discountPercent(product.price, product.compareAtPrice);

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/[0.07] bg-ink-900/40 transition-all duration-300 hover:-translate-y-1 hover:border-gold-400/30 hover:shadow-[0_24px_50px_-30px_rgba(208,172,76,0.55)]">
      <Link
        href={`/products/${product.slug}`}
        className="relative block aspect-[4/5] overflow-hidden bg-ink-900"
      >
        <ProductImage
          src={product.image}
          alt={`${product.name} by ${brand?.name ?? "Frangrant Aura"}`}
          priority={priority}
          accent={brand?.accent}
          className="object-cover transition-transform duration-700 group-hover:scale-[1.06]"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-950/85 via-ink-950/10 to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-95" />

        {discount > 0 && (
          <span className="absolute left-3 top-3 rounded-full bg-gold-400 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-ink-950">
            −{discount}%
          </span>
        )}
        {!discount && product.badge && (
          <span className="absolute left-3 top-3 rounded-full border border-white/20 bg-ink-950/70 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-gold-200 backdrop-blur-sm">
            {product.badge}
          </span>
        )}
        {product.stock <= 8 && (
          <span className="absolute right-3 top-3 rounded-full border border-white/15 bg-ink-950/70 px-2.5 py-1 text-[10px] font-medium text-ink-200 backdrop-blur-sm">
            Only {product.stock} left
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-5">
        {brand && (
          <Link
            href={`/brands/${brand.slug}`}
            className="eyebrow transition-colors hover:text-gold-200"
          >
            {brand.name}
          </Link>
        )}

        <h3 className="mt-2 font-display text-xl leading-snug text-white">
          <Link href={`/products/${product.slug}`} className="hover:text-gold-100">
            {product.name}
          </Link>
        </h3>

        <p className="mt-1 text-xs uppercase tracking-wider text-ink-500">
          {product.sizeMl}ml · {product.concentration} · {product.audience}
        </p>

        <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-ink-300">
          {product.summary}
        </p>

        <div className="mt-4">
          <StarRating rating={product.rating} reviewCount={product.reviewCount} />
        </div>

        <div className="mt-auto flex items-end justify-between gap-3 pt-5">
          <div>
            <span className="font-display text-2xl text-gold-200">
              {formatPrice(product.price)}
            </span>
            {product.compareAtPrice && (
              <span className="ml-2 text-xs text-ink-500 line-through">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
          </div>
        </div>

        <div className="mt-4 grid grid-cols-[1fr_auto] gap-2">
          <AddToCartButton slug={product.slug} fullWidth />
          <Link
            href={`/products/${product.slug}`}
            className="btn-secondary px-4"
            aria-label={`View ${product.name}`}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
            >
              <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" />
            </svg>
          </Link>
        </div>
      </div>
    </article>
  );
}
