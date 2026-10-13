import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import Reveal from "@/components/Reveal";
import {
  brands,
  getBrandBySlug,
  getBrandPriceRange,
  getProductsByBrand,
} from "@/lib/products";
import { priceBuckets } from "@/lib/config";
import { formatPrice } from "@/lib/format";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return brands.map((brand) => ({ slug: brand.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const brand = getBrandBySlug(slug);
  if (!brand) return { title: "House not found" };

  return {
    title: `${brand.name} — fragrances`,
    description: `${brand.excerpt} Shop ${brand.name} at Frangrant Aura, ${getBrandPriceRange(brand.slug)}.`,
  };
}

export default async function BrandPage({ params }: PageProps) {
  const { slug } = await params;
  const brand = getBrandBySlug(slug);

  if (!brand) notFound();

  const products = getProductsByBrand(brand.slug);
  const prices = products.map((product) => product.price);
  const cheapest = Math.min(...prices);
  const dearest = Math.max(...prices);

  const bucketsInBrand = priceBuckets
    .map((bucket) => ({
      ...bucket,
      count: products.filter(
        (product) =>
          product.price >= bucket.min && product.price < bucket.max,
      ).length,
    }))
    .filter((bucket) => bucket.count > 0);

  return (
    <div className="container-page py-8">
      <nav className="flex flex-wrap items-center gap-2 text-xs text-ink-400">
        <Link href="/" className="transition hover:text-gold-200">
          Home
        </Link>
        <span className="text-ink-600">/</span>
        <Link href="/brands" className="transition hover:text-gold-200">
          Houses
        </Link>
        <span className="text-ink-600">/</span>
        <span className="text-ink-200">{brand.name}</span>
      </nav>

      {/* ------------------------------ Hero ------------------------------- */}
      <header className="grain relative mt-8 overflow-hidden rounded-3xl border border-white/[0.08] px-7 py-14 sm:px-12 sm:py-16">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -right-20 -top-24 h-80 w-80 rounded-full opacity-20 blur-[110px]"
          style={{ backgroundColor: brand.accent }}
        />
        <div className="relative max-w-3xl">
          <p className="eyebrow">
            {brand.origin} · Est. {brand.founded}
          </p>
          <h1 className="mt-5 font-display text-5xl leading-tight text-white sm:text-6xl">
            {brand.name}
          </h1>
          <p className="mt-3 font-display text-xl italic text-gold-300/90">
            {brand.tagline}
          </p>
          <p className="mt-7 text-base leading-relaxed text-ink-200">
            {brand.story}
          </p>

          <dl className="mt-9 flex flex-wrap gap-x-12 gap-y-5 border-t border-white/[0.08] pt-7">
            <div>
              <dt className="text-[10px] uppercase tracking-[0.2em] text-ink-500">
                Fragrances
              </dt>
              <dd className="mt-1 font-display text-3xl text-gold-200">
                {products.length}
              </dd>
            </div>
            <div>
              <dt className="text-[10px] uppercase tracking-[0.2em] text-ink-500">
                From
              </dt>
              <dd className="mt-1 font-display text-3xl text-gold-200">
                {formatPrice(cheapest)}
              </dd>
            </div>
            <div>
              <dt className="text-[10px] uppercase tracking-[0.2em] text-ink-500">
                Up to
              </dt>
              <dd className="mt-1 font-display text-3xl text-gold-200">
                {formatPrice(dearest)}
              </dd>
            </div>
          </dl>
        </div>
      </header>

      {/* -------------------------- Price shortcuts ------------------------ */}
      {bucketsInBrand.length > 1 && (
        <section className="mt-10">
          <h2 className="text-xs font-semibold uppercase tracking-[0.22em] text-gold-300">
            Shop {brand.name} by price
          </h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {bucketsInBrand.map((bucket) => {
              const href =
                bucket.max === Infinity
                  ? `/shop?brand=${brand.slug}&min=${bucket.min}`
                  : `/shop?brand=${brand.slug}&min=${bucket.min}&max=${bucket.max}`;
              return (
                <Link
                  key={bucket.id}
                  href={href}
                  className="chip hover:border-gold-400/50 hover:text-white"
                >
                  {bucket.label}
                  <span className="ml-2 text-ink-500">{bucket.count}</span>
                </Link>
              );
            })}
            <Link
              href={`/shop?brand=${brand.slug}&sort=price-asc`}
              className="chip hover:border-gold-400/50 hover:text-white"
            >
              Cheapest first
            </Link>
          </div>
        </section>
      )}

      {/* ----------------------------- Products ---------------------------- */}
      <section className="mt-12">
        <h2 className="section-title text-white">
          {products.length} {products.length === 1 ? "fragrance" : "fragrances"}
        </h2>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product, index) => (
            <Reveal key={product.slug} delay={index * 60}>
              <ProductCard product={product} priority={index < 3} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* --------------------------- Other houses -------------------------- */}
      <section className="mt-20 border-t border-white/[0.07] pt-10">
        <h2 className="font-display text-2xl text-white">Other houses</h2>
        <div className="mt-6 flex flex-wrap gap-2">
          {brands
            .filter((entry) => entry.slug !== brand.slug)
            .map((entry) => (
              <Link
                key={entry.slug}
                href={`/brands/${entry.slug}`}
                className="chip hover:border-gold-400/50 hover:text-white"
              >
                {entry.name}
              </Link>
            ))}
        </div>
      </section>
    </div>
  );
}
