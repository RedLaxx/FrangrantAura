import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import ProductImage from "@/components/ProductImage";
import {
  brands,
  getFeaturedProducts,
  getProductsByBrand,
  products,
} from "@/lib/products";
import { priceBuckets, siteConfig, whatsappNumber } from "@/lib/config";
import { formatPrice } from "@/lib/format";

const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/\D/g, "")}`;

const heroProducts = ["ember-oud", "lumiere-d-or", "sable-dore"]
  .map((slug) => products.find((product) => product.slug === slug))
  .filter((product): product is NonNullable<typeof product> => Boolean(product));

const scentFamilies = [
  {
    name: "Floral",
    blurb: "Rose, jasmine, tuberose",
    query: "family=Floral",
  },
  {
    name: "Oriental",
    blurb: "Oud, resins, spice",
    query: "family=Oriental",
  },
  {
    name: "Fresh",
    blurb: "Citrus, salt, green",
    query: "family=Fresh",
  },
  {
    name: "Gourmand",
    blurb: "Vanilla, praline, tonka",
    query: "family=Gourmand",
  },
];

export default function HomePage() {
  const featured = getFeaturedProducts(6);
  const lowestPrice = Math.min(...products.map((product) => product.price));

  return (
    <>
      {/* ============================== HERO ============================== */}
      <section className="grain relative overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-40 top-[-20%] h-[560px] w-[560px] rounded-full bg-gold-500/10 blur-[130px]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-32 bottom-[-30%] h-[460px] w-[460px] rounded-full bg-gold-400/[0.07] blur-[120px]"
        />

        <div className="container-page relative grid items-center gap-14 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8 lg:py-24">
          <div className="max-w-xl">
            <p className="eyebrow animate-fade-up">{siteConfig.tagline}</p>

            <h1 className="mt-6 animate-fade-up font-display text-[3rem] leading-[0.95] text-white sm:text-6xl lg:text-[4.25rem]">
              Wear something
              <br />
              <span className="gold-gradient-text italic">unforgettable</span>
            </h1>

            <p
              className="mt-7 max-w-lg animate-fade-up text-base leading-relaxed text-ink-300 sm:text-lg"
              style={{ animationDelay: "80ms" }}
            >
              A curated house of niche and designer fragrance, sourced directly
              from the makers. Ten rare compositions from five houses, from{" "}
              <span className="text-gold-200">{formatPrice(lowestPrice)}</span>{" "}
              to extrait-strength oud.
            </p>

            <div
              className="mt-9 flex animate-fade-up flex-wrap items-center gap-3"
              style={{ animationDelay: "160ms" }}
            >
              <Link href="/shop" className="btn-primary">
                Shop the collection
              </Link>
              <Link href="/brands" className="btn-secondary">
                Explore houses
              </Link>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost inline-flex items-center gap-2 border border-white/10 px-5 py-3"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.75-1.64-2.05-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.01-1.04 2.47s1.06 2.86 1.21 3.06c.15.2 2.09 3.19 5.06 4.47.71.3 1.26.49 1.69.62.71.23 1.36.19 1.87.12.57-.09 1.75-.72 2-1.41.25-.69.25-1.28.17-1.41-.07-.13-.27-.2-.57-.35Z" />
                  <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.29-1.39a9.9 9.9 0 0 0 4.75 1.21h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.84 9.84 0 0 0 12.04 2Zm0 18.15a8.2 8.2 0 0 1-4.18-1.14l-.3-.18-3.12.82.83-3.04-.19-.31a8.19 8.19 0 0 1-1.26-4.39c0-4.54 3.7-8.24 8.24-8.24 2.2 0 4.27.86 5.82 2.42a8.17 8.17 0 0 1 2.41 5.83c-.01 4.54-3.71 8.23-8.25 8.23Z" />
                </svg>
                Ask a perfumer
              </a>
            </div>

            <dl className="mt-12 grid max-w-lg grid-cols-3 gap-6 border-t border-white/[0.07] pt-7">
              {[
                { value: "100%", label: "Authentic, direct from the house" },
                { value: "48h", label: "Delivery across Lagos" },
                { value: "5", label: "Niche houses in residence" },
              ].map((stat) => (
                <div key={stat.label}>
                  <dt className="font-display text-3xl text-gold-200">
                    {stat.value}
                  </dt>
                  <dd className="mt-1.5 text-[11px] leading-snug text-ink-400">
                    {stat.label}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Hero collage */}
          <div className="relative">
            <div className="grid grid-cols-5 grid-rows-6 gap-4 sm:gap-5">
              <Link
                href="/products/ember-oud"
                className="group relative col-span-3 row-span-6 overflow-hidden rounded-3xl border border-white/[0.08] bg-ink-900"
              >
                <ProductImage
                  src={heroProducts[0].image}
                  alt={heroProducts[0].name}
                  priority
                  sizes="(max-width: 1024px) 60vw, 380px"
                  wrapperClassName="absolute inset-0"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <p className="eyebrow">Oud &amp; Ember</p>
                  <p className="mt-1 font-display text-2xl text-white">
                    Ember Oud
                  </p>
                  <p className="mt-1 text-sm text-gold-200">
                    {formatPrice(heroProducts[0].price)}
                  </p>
                </div>
              </Link>

              {heroProducts.slice(1).map((product, index) => (
                <Link
                  key={product.slug}
                  href={`/products/${product.slug}`}
                  className={`group relative col-span-2 row-span-3 overflow-hidden rounded-3xl border border-white/[0.08] bg-ink-900 ${
                    index === 1 ? "row-start-4" : ""
                  }`}
                >
                  <ProductImage
                    src={product.image}
                    alt={product.name}
                    sizes="(max-width: 1024px) 30vw, 220px"
                    wrapperClassName="absolute inset-0"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-950/90 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-4">
                    <p className="font-display text-lg leading-tight text-white">
                      {product.name}
                    </p>
                    <p className="mt-0.5 text-xs text-gold-200">
                      {formatPrice(product.price)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ========================= SHOP BY PRICE ========================= */}
      <section className="container-page py-20">
        <Reveal>
          <SectionHeading
            eyebrow="Find your price"
            title="What are you looking to spend?"
            description="Every fragrance is in stock and priced in Naira. Pick a budget and we'll show you exactly what fits."
          />
        </Reveal>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {priceBuckets.map((bucket, index) => {
            const href =
              bucket.max === Infinity
                ? `/shop?min=${bucket.min}`
                : `/shop?min=${bucket.min}&max=${bucket.max}`;
            const count = products.filter(
              (product) =>
                product.price >= bucket.min && product.price < bucket.max,
            ).length;

            return (
              <Reveal key={bucket.id} delay={index * 70}>
                <Link
                  href={href}
                  className="group flex h-full flex-col justify-between rounded-2xl border border-white/[0.07] bg-ink-900/40 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-gold-400/40 hover:bg-ink-900/80"
                >
                  <span className="eyebrow">
                    {index === 0
                      ? "Everyday"
                      : index === 3
                        ? "Collector"
                        : "Signature"}
                  </span>
                  <span className="mt-6 block font-display text-2xl leading-tight text-white">
                    {bucket.label}
                  </span>
                  <span className="mt-6 flex items-center justify-between text-xs text-ink-400">
                    {count} {count === 1 ? "fragrance" : "fragrances"}
                    <span className="text-gold-300 transition-transform duration-200 group-hover:translate-x-1">
                      →
                    </span>
                  </span>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* ========================= FEATURED ============================== */}
      <section className="container-page py-10">
        <Reveal>
          <SectionHeading
            eyebrow="This month's edit"
            title="Featured fragrances"
            description="The bottles our customers come back for — hand-picked by the house."
            action={{ href: "/shop", label: "View all" }}
          />
        </Reveal>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((product, index) => (
            <Reveal key={product.slug} delay={index * 60}>
              <ProductCard product={product} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* ============================ BRANDS ============================ */}
      <section className="container-page py-20">
        <Reveal>
          <SectionHeading
            eyebrow="The houses"
            title="Five brands we stand behind"
            description="We only stock houses we have worn ourselves. Tap through to read each story and see what's in stock."
            action={{ href: "/brands", label: "All houses" }}
          />
        </Reveal>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {brands.map((brand, index) => {
            const count = getProductsByBrand(brand.slug).length;
            return (
              <Reveal
                key={brand.slug}
                delay={index * 60}
                className={index === 4 ? "sm:col-span-2 lg:col-span-1" : ""}
              >
                <Link
                  href={`/brands/${brand.slug}`}
                  className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/[0.07] bg-ink-900/40 p-7 transition-all duration-300 hover:-translate-y-1 hover:border-gold-400/30"
                >
                  <span
                    aria-hidden="true"
                    className="absolute -right-16 -top-16 h-40 w-40 rounded-full opacity-20 blur-3xl transition-opacity duration-500 group-hover:opacity-40"
                    style={{ backgroundColor: brand.accent }}
                  />
                  <span className="eyebrow relative">
                    {brand.origin} · Est. {brand.founded}
                  </span>
                  <h3 className="relative mt-4 font-display text-2xl text-white">
                    {brand.name}
                  </h3>
                  <p className="relative mt-1 text-sm italic text-gold-300/80">
                    {brand.tagline}
                  </p>
                  <p className="relative mt-4 text-sm leading-relaxed text-ink-300">
                    {brand.excerpt}
                  </p>
                  <p className="relative mt-6 flex items-center justify-between text-xs text-ink-400">
                    {count} {count === 1 ? "fragrance" : "fragrances"}
                    <span className="text-gold-300 transition-transform duration-200 group-hover:translate-x-1">
                      →
                    </span>
                  </p>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* ========================= SCENT FINDER ========================= */}
      <section className="container-page py-10">
        <Reveal>
          <div className="surface relative overflow-hidden px-7 py-12 sm:px-12">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-gold-500/10 blur-[100px]"
            />
            <div className="relative">
              <SectionHeading
                eyebrow="Not sure where to start?"
                title="Shop by scent family"
                description="Filter the whole collection by the notes you already love."
              />
              <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {scentFamilies.map((family) => (
                  <Link
                    key={family.name}
                    href={`/shop?${family.query}`}
                    className="group rounded-xl border border-white/[0.07] bg-ink-900/50 px-5 py-5 transition hover:border-gold-400/40 hover:bg-ink-900"
                  >
                    <span className="block font-display text-xl text-white">
                      {family.name}
                    </span>
                    <span className="mt-1 block text-xs text-ink-400">
                      {family.blurb}
                    </span>
                    <span className="mt-4 block text-xs text-gold-300 transition-transform duration-200 group-hover:translate-x-1">
                      Explore →
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ========================== HOW IT WORKS ======================== */}
      <section className="container-page py-20">
        <Reveal>
          <SectionHeading
            eyebrow="Ordering"
            title="Three steps to your new signature"
            align="center"
          />
        </Reveal>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {[
            {
              step: "01",
              title: "Find your scent",
              body: "Browse by house, filter by price or scent family, and read the full note breakdown before you commit.",
            },
            {
              step: "02",
              title: "Check out your way",
              body: "Pay securely by card or bank transfer through Paystack, or send your order straight to us on WhatsApp and we'll confirm stock.",
            },
            {
              step: "03",
              title: "Receive it in Lagos",
              body: "Same-day dispatch on orders placed before 2pm, and free delivery once your basket passes ₦150,000.",
            },
          ].map((item, index) => (
            <Reveal key={item.step} delay={index * 90}>
              <div className="surface h-full p-7">
                <span className="font-display text-4xl text-gold-400/40">
                  {item.step}
                </span>
                <h3 className="mt-4 font-display text-2xl text-white">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-300">
                  {item.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ============================ CTA BAND ========================== */}
      <section className="container-page pb-8">
        <Reveal>
          <div className="grain relative overflow-hidden rounded-3xl border border-gold-400/20 bg-ink-900 px-7 py-14 text-center sm:px-14">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(80%_120%_at_50%_0%,rgba(208,172,76,0.14)_0%,transparent_60%)]"
            />
            <div className="relative">
              <p className="eyebrow">Ready when you are</p>
              <h2 className="mx-auto mt-5 max-w-2xl font-display text-4xl text-white sm:text-5xl">
                Let's find the fragrance that gets you noticed
              </h2>
              <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-ink-300 sm:text-base">
                Not sure which one? Tell us what you usually wear and we'll send
                three recommendations — no obligation.
              </p>
              <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
                <Link href="/shop" className="btn-primary">
                  Start shopping
                </Link>
                <a
                  href={`${whatsappUrl}?text=${encodeURIComponent(
                    "Hello Frangrant Aura! I'd love a recommendation — can you help?",
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary"
                >
                  Get a free recommendation
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
