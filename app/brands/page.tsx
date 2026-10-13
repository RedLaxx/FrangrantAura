import type { Metadata } from "next";
import Link from "next/link";
import ProductImage from "@/components/ProductImage";
import Reveal from "@/components/Reveal";
import {
  brands,
  countProductsByBrand,
  getBrandPriceRange,
  getProductsByBrand,
} from "@/lib/products";

export const metadata: Metadata = {
  title: "Fragrance houses",
  description:
    "The five niche and designer fragrance houses stocked by Frangrant Aura — read each story and shop what's in stock.",
};

export default function BrandsPage() {
  return (
    <div className="container-page py-14">
      <header className="max-w-3xl border-b border-white/[0.07] pb-10">
        <p className="eyebrow mb-4">The houses</p>
        <h1 className="font-display text-4xl leading-tight text-white sm:text-5xl">
          Five houses we stock, wear and stand behind
        </h1>
        <p className="mt-5 text-base leading-relaxed text-ink-300">
          We don't chase every trend. Each house here earned its place on this
          shelf because we wore it, loved it, and kept reaching for it.
        </p>
      </header>

      <div className="mt-12 space-y-8">
        {brands.map((brand, index) => {
          const products = getProductsByBrand(brand.slug);
          const previews = products.slice(0, 3);

          return (
            <Reveal key={brand.slug} delay={index * 60}>
              <div className="surface group relative overflow-hidden transition-colors hover:border-gold-400/25">
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full opacity-[0.12] blur-[90px] transition-opacity duration-500 group-hover:opacity-25"
                  style={{ backgroundColor: brand.accent }}
                />

                <div className="relative grid gap-8 p-7 sm:p-9 lg:grid-cols-[1.15fr_1fr] lg:gap-12">
                  <div>
                    <p className="eyebrow">
                      {brand.origin} · Est. {brand.founded}
                    </p>
                    <h2 className="mt-4 font-display text-3xl text-white sm:text-4xl">
                      <Link
                        href={`/brands/${brand.slug}`}
                        className="transition hover:text-gold-100"
                      >
                        {brand.name}
                      </Link>
                    </h2>
                    <p className="mt-1.5 text-sm italic text-gold-300/80">
                      {brand.tagline}
                    </p>
                    <p className="mt-5 max-w-xl text-sm leading-relaxed text-ink-300">
                      {brand.excerpt}
                    </p>

                    <dl className="mt-7 flex flex-wrap gap-x-10 gap-y-4">
                      <div>
                        <dt className="text-[10px] uppercase tracking-[0.2em] text-ink-500">
                          Fragrances
                        </dt>
                        <dd className="mt-1 font-display text-2xl text-gold-200">
                          {countProductsByBrand(brand.slug)}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-[10px] uppercase tracking-[0.2em] text-ink-500">
                          Price range
                        </dt>
                        <dd className="mt-1 font-display text-2xl text-gold-200">
                          {getBrandPriceRange(brand.slug)}
                        </dd>
                      </div>
                    </dl>

                    <div className="mt-7 flex flex-wrap gap-3">
                      <Link
                        href={`/brands/${brand.slug}`}
                        className="btn-primary"
                      >
                        Shop {brand.name}
                      </Link>
                      <Link
                        href={`/shop?brand=${brand.slug}&sort=price-asc`}
                        className="btn-secondary"
                      >
                        Cheapest first
                      </Link>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3 lg:gap-4">
                    {previews.map((product) => (
                      <Link
                        key={product.slug}
                        href={`/products/${product.slug}`}
                        className="group/card relative aspect-[3/4] overflow-hidden rounded-xl border border-white/[0.07] bg-ink-900"
                      >
                        <ProductImage
                          src={product.image}
                          alt={product.name}
                          accent={brand.accent}
                          sizes="(max-width: 640px) 30vw, 180px"
                          className="object-cover transition-transform duration-700 group-hover/card:scale-105"
                        />
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-950/90 to-transparent" />
                        <span className="absolute inset-x-0 bottom-0 p-2.5 font-display text-sm leading-tight text-white">
                          {product.name}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </div>
  );
}
