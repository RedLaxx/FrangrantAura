import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import ProductImage from "@/components/ProductImage";
import { brands, products } from "@/lib/products";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: "About",
  description:
    "Frangrant Aura is a curated fragrance house in Lagos, Nigeria, stocking authentic niche and designer perfumes for women and men.",
};

const values = [
  {
    title: "Sourced directly, never grey",
    body: "Every bottle comes straight from the house or its authorised distributor. No parallel imports, no refills, no replicas — if we can't trace it, we don't sell it.",
  },
  {
    title: "Worn before it's stocked",
    body: "We wear every fragrance for at least a week before it goes on the shelf. That's why each product page tells you how long it lasts and how far it projects.",
  },
  {
    title: "Honest pricing in Naira",
    body: "Prices are clear, inclusive and in Naira. Filter by what you want to spend and you'll never get a surprise at checkout.",
  },
  {
    title: "Advice that isn't a sales pitch",
    body: "Message us on WhatsApp with what you already wear. If nothing in our collection suits you, we'll say so.",
  },
];

export default function AboutPage() {
  return (
    <div className="container-page py-14">
      <header className="max-w-3xl border-b border-white/[0.07] pb-12">
        <p className="eyebrow mb-4">Our story</p>
        <h1 className="font-display text-4xl leading-tight text-white sm:text-5xl">
          A house built on the belief that everyone deserves a signature scent
        </h1>
        <p className="mt-6 text-base leading-relaxed text-ink-300">
          Frangrant Aura started in {siteConfig.city} with a small shelf, a lot
          of blotter cards and one stubborn idea: buying fragrance in Nigeria
          shouldn't feel like a gamble. Too many people had been sold diluted
          decants and counterfeit boxes.
        </p>
        <p className="mt-4 text-base leading-relaxed text-ink-300">
          So we did the slow thing. We went direct to the houses, we learned the
          supply chain, and we built a collection of{" "}
          {products.length} fragrances from {brands.length} houses that we can
          vouch for, one by one.
        </p>
      </header>

      <section className="mt-16">
        <div className="grid gap-6 md:grid-cols-2">
          {values.map((value, index) => (
            <Reveal key={value.title} delay={index * 70}>
              <div className="surface h-full p-8">
                <h2 className="font-display text-2xl text-white">
                  {value.title}
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-ink-300">
                  {value.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mt-20">
        <h2 className="section-title text-white">The houses we carry</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {brands.map((brand) => {
            const heroProduct = products.find(
              (product) => product.brandSlug === brand.slug,
            );
            return (
              <Link
                key={brand.slug}
                href={`/brands/${brand.slug}`}
                className="group relative overflow-hidden rounded-2xl border border-white/[0.07] bg-ink-900/50 p-6 transition hover:border-gold-400/30"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="eyebrow">{brand.origin}</p>
                    <h3 className="mt-3 font-display text-2xl text-white">
                      {brand.name}
                    </h3>
                    <p className="mt-1 text-sm italic text-gold-300/80">
                      {brand.tagline}
                    </p>
                  </div>
                  {heroProduct && (
                    <div className="relative h-16 w-12 shrink-0 overflow-hidden rounded-lg border border-white/[0.07] bg-ink-900">
                      <ProductImage
                        src={heroProduct.image}
                        alt={heroProduct.name}
                        accent={brand.accent}
                        sizes="48px"
                      />
                    </div>
                  )}
                </div>
                <p className="mt-5 text-sm leading-relaxed text-ink-300">
                  {brand.excerpt}
                </p>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="mt-20">
        <Reveal>
          <div className="grain relative overflow-hidden rounded-3xl border border-gold-400/20 bg-ink-900 px-7 py-14 text-center sm:px-12">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(80%_120%_at_50%_0%,rgba(208,172,76,0.13)_0%,transparent_60%)]"
            />
            <div className="relative">
              <h2 className="mx-auto max-w-xl font-display text-4xl text-white">
                Visit us, or let us come to you
              </h2>
              <p className="mx-auto mt-5 max-w-lg text-sm leading-relaxed text-ink-300">
                {siteConfig.address}. {siteConfig.openingHours}. Prefer to
                browse from home? The full collection is online with secure
                Paystack checkout and WhatsApp ordering.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <Link href="/shop" className="btn-primary">
                  Shop the collection
                </Link>
                <Link href="/contact" className="btn-secondary">
                  Get in touch
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
