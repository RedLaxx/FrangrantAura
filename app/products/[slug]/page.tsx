import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ProductImage from "@/components/ProductImage";
import ProductPurchasePanel from "@/components/ProductPurchasePanel";
import ProductCard from "@/components/ProductCard";
import StarRating from "@/components/StarRating";
import Reveal from "@/components/Reveal";
import {
  formatNotes,
  getBrandBySlug,
  getProductBySlug,
  getRelatedProducts,
  products,
} from "@/lib/products";
import { discountPercent, formatPrice } from "@/lib/format";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return { title: "Fragrance not found" };

  const brand = getBrandBySlug(product.brandSlug);

  return {
    title: `${product.name} — ${product.sizeMl}ml ${product.concentration}`,
    description: `${product.summary} From ${brand?.name ?? "Frangrant Aura"}, ${formatPrice(product.price)}.`,
    openGraph: {
      title: `${product.name} · ${brand?.name ?? "Frangrant Aura"}`,
      description: product.summary,
      images: [{ url: product.image }],
    },
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) notFound();

  const brand = getBrandBySlug(product.brandSlug);
  const related = getRelatedProducts(product, 4);
  const discount = discountPercent(product.price, product.compareAtPrice);

  const noteGroups = [
    { label: "Top notes", notes: product.topNotes },
    { label: "Heart notes", notes: product.heartNotes },
    { label: "Base notes", notes: product.baseNotes },
  ];

  const specs = [
    { label: "House", value: brand?.name ?? "—" },
    { label: "Concentration", value: product.concentration },
    { label: "Volume", value: `${product.sizeMl}ml` },
    { label: "Wear for", value: product.audience },
    { label: "Longevity", value: product.longevity },
    { label: "Sillage", value: product.sillage },
    { label: "Best in", value: product.season },
    { label: "Scent families", value: product.families.join(", ") },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.image,
    description: product.summary,
    brand: { "@type": "Brand", name: brand?.name ?? "Frangrant Aura" },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.rating,
      reviewCount: product.reviewCount,
    },
    offers: {
      "@type": "Offer",
      priceCurrency: "NGN",
      price: product.price,
      availability:
        product.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="container-page py-8">
        <nav className="flex flex-wrap items-center gap-2 text-xs text-ink-400">
          <Link href="/" className="transition hover:text-gold-200">
            Home
          </Link>
          <span className="text-ink-600">/</span>
          <Link href="/shop" className="transition hover:text-gold-200">
            Shop
          </Link>
          {brand && (
            <>
              <span className="text-ink-600">/</span>
              <Link
                href={`/brands/${brand.slug}`}
                className="transition hover:text-gold-200"
              >
                {brand.name}
              </Link>
            </>
          )}
          <span className="text-ink-600">/</span>
          <span className="text-ink-200">{product.name}</span>
        </nav>

        <div className="mt-8 grid gap-12 lg:grid-cols-[1fr_1fr] lg:gap-16">
          {/* ---------------------------- Gallery --------------------------- */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div
              className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-white/[0.08] bg-ink-900"
              style={{
                background: brand
                  ? `radial-gradient(120% 90% at 50% 0%, ${brand.accent}1a 0%, transparent 55%), #0d0d10`
                  : "#0d0d10",
              }}
            >
              <ProductImage
                src={product.image}
                alt={`${product.name} by ${brand?.name ?? "Frangrant Aura"}`}
                priority
                sizes="(max-width: 1024px) 92vw, 560px"
              />
            </div>

            <div className="mt-4 grid grid-cols-3 gap-4 text-center">
              {[
                { label: "Longevity", value: product.longevity },
                { label: "Sillage", value: product.sillage },
                { label: "Best in", value: product.season },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-xl border border-white/[0.07] bg-white/[0.02] px-3 py-4"
                >
                  <p className="text-[10px] uppercase tracking-[0.18em] text-ink-500">
                    {item.label}
                  </p>
                  <p className="mt-1.5 text-xs leading-snug text-ink-100">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* ----------------------------- Detail --------------------------- */}
          <div>
            {brand && (
              <Link
                href={`/brands/${brand.slug}`}
                className="eyebrow transition hover:text-gold-200"
              >
                {brand.name}
              </Link>
            )}

            <h1 className="mt-4 font-display text-4xl leading-tight text-white sm:text-5xl">
              {product.name}
            </h1>

            <p className="mt-3 text-sm uppercase tracking-[0.18em] text-ink-400">
              {product.sizeMl}ml · {product.concentration} · {product.audience}
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-4">
              <StarRating
                rating={product.rating}
                reviewCount={product.reviewCount}
                size="md"
              />
              <span className="h-4 w-px bg-white/10" />
              <span className="text-xs text-ink-400">
                {product.stock > 0
                  ? `${product.stock} in stock`
                  : "Currently unavailable"}
              </span>
            </div>

            <div className="mt-7 flex flex-wrap items-baseline gap-3">
              <span className="font-display text-4xl text-gold-200">
                {formatPrice(product.price)}
              </span>
              {product.compareAtPrice && (
                <>
                  <span className="text-base text-ink-500 line-through">
                    {formatPrice(product.compareAtPrice)}
                  </span>
                  <span className="rounded-full bg-gold-400/15 px-2.5 py-1 text-xs font-semibold text-gold-200">
                    Save {discount}%
                  </span>
                </>
              )}
            </div>

            <p className="mt-6 text-base leading-relaxed text-ink-200">
              {product.summary}
            </p>

            <div className="mt-8">
              <ProductPurchasePanel product={product} />
            </div>

            {/* -------------------------- Notes -------------------------- */}
            <section className="mt-12">
              <h2 className="font-display text-2xl text-white">The composition</h2>
              <div className="mt-5 space-y-3">
                {noteGroups.map((group) => (
                  <div
                    key={group.label}
                    className="flex flex-col gap-1 rounded-xl border border-white/[0.07] bg-white/[0.02] px-5 py-4 sm:flex-row sm:items-baseline sm:gap-5"
                  >
                    <span className="w-28 shrink-0 text-[10px] uppercase tracking-[0.2em] text-gold-300">
                      {group.label}
                    </span>
                    <span className="text-sm leading-relaxed text-ink-200">
                      {formatNotes(group.notes)}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* ------------------------ Description ----------------------- */}
            <section className="mt-12">
              <h2 className="font-display text-2xl text-white">About this scent</h2>
              <p className="mt-4 text-sm leading-loose text-ink-300">
                {product.description}
              </p>
            </section>

            {/* --------------------------- Specs -------------------------- */}
            <section className="mt-12">
              <h2 className="font-display text-2xl text-white">Details</h2>
              <dl className="mt-5 grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-white/[0.07] bg-white/[0.05] sm:grid-cols-2">
                {specs.map((spec) => (
                  <div
                    key={spec.label}
                    className="flex items-baseline justify-between gap-4 bg-ink-900 px-5 py-3.5"
                  >
                    <dt className="text-xs uppercase tracking-wider text-ink-500">
                      {spec.label}
                    </dt>
                    <dd className="text-right text-sm text-ink-100">
                      {spec.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>

            {brand && (
              <section className="mt-12">
                <h2 className="font-display text-2xl text-white">
                  More from {brand.name}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-ink-300">
                  {brand.excerpt}
                </p>
                <Link
                  href={`/brands/${brand.slug}`}
                  className="mt-4 inline-flex items-center gap-2 text-sm text-gold-200 transition hover:text-gold-100"
                >
                  Visit the house
                  <span>→</span>
                </Link>
              </section>
            )}
          </div>
        </div>

        {/* ---------------------------- Related ---------------------------- */}
        <section className="mt-24">
          <Reveal>
            <h2 className="section-title text-white">You may also like</h2>
            <p className="mt-3 text-sm text-ink-300">
              Similar houses, families and price points.
            </p>
          </Reveal>

          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((item, index) => (
              <Reveal key={item.slug} delay={index * 60}>
                <ProductCard product={item} />
              </Reveal>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
