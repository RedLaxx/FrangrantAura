import Link from "next/link";
import { brands } from "@/lib/products";
import { siteConfig, whatsappNumber } from "@/lib/config";

const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/\D/g, "")}`;

export default function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-white/[0.07] bg-ink-950">
      <div className="container-page py-16">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <span className="font-display text-3xl text-white">
              Frangrant<span className="gold-gradient-text">Aura</span>
            </span>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-ink-300">
              A curated fragrance house in {siteConfig.city}, stocking niche and
              designer perfumes for women and men. Every bottle is sourced
              directly from the house — no grey imports, no replicas.
            </p>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary mt-6"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.75-1.64-2.05-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.01-1.04 2.47s1.06 2.86 1.21 3.06c.15.2 2.09 3.19 5.06 4.47.71.3 1.26.49 1.69.62.71.23 1.36.19 1.87.12.57-.09 1.75-.72 2-1.41.25-.69.25-1.28.17-1.41-.07-.13-.27-.2-.57-.35Z" />
                <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.29-1.39a9.9 9.9 0 0 0 4.75 1.21h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.84 9.84 0 0 0 12.04 2Zm0 18.15a8.2 8.2 0 0 1-4.18-1.14l-.3-.18-3.12.82.83-3.04-.19-.31a8.19 8.19 0 0 1-1.26-4.39c0-4.54 3.7-8.24 8.24-8.24 2.2 0 4.27.86 5.82 2.42a8.17 8.17 0 0 1 2.41 5.83c-.01 4.54-3.71 8.23-8.25 8.23Z" />
              </svg>
              Chat on WhatsApp
            </a>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.22em] text-gold-300">
              Shop
            </h3>
            <ul className="mt-5 space-y-3 text-sm text-ink-300">
              <li>
                <Link href="/shop" className="transition hover:text-gold-200">
                  All fragrances
                </Link>
              </li>
              <li>
                <Link
                  href="/shop?max=50000"
                  className="transition hover:text-gold-200"
                >
                  Under ₦50,000
                </Link>
              </li>
              <li>
                <Link
                  href="/shop?min=100000"
                  className="transition hover:text-gold-200"
                >
                  ₦100,000 &amp; above
                </Link>
              </li>
              <li>
                <Link
                  href="/shop?sort=rating"
                  className="transition hover:text-gold-200"
                >
                  Highest rated
                </Link>
              </li>
              <li>
                <Link href="/brands" className="transition hover:text-gold-200">
                  Browse by brand
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.22em] text-gold-300">
              Houses
            </h3>
            <ul className="mt-5 space-y-3 text-sm text-ink-300">
              {brands.map((brand) => (
                <li key={brand.slug}>
                  <Link
                    href={`/brands/${brand.slug}`}
                    className="transition hover:text-gold-200"
                  >
                    {brand.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.22em] text-gold-300">
              Visit
            </h3>
            <ul className="mt-5 space-y-3 text-sm text-ink-300">
              <li className="leading-relaxed">{siteConfig.address}</li>
              <li>{siteConfig.openingHours}</li>
              <li>
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="transition hover:text-gold-200"
                >
                  {siteConfig.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-white/[0.07] pt-7 text-xs text-ink-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </p>
          <p>
            Secure payments by{" "}
            <span className="text-ink-300">Paystack</span> · Orders also taken
            on WhatsApp
          </p>
        </div>
      </div>
    </footer>
  );
}
