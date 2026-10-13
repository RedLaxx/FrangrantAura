"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useCart } from "@/lib/cart";
import { siteConfig } from "@/lib/config";

const navigation = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/brands", label: "Brands" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function SiteHeader() {
  const pathname = usePathname();
  const { count, openCart } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-white/[0.07] bg-ink-950/85 backdrop-blur-xl"
          : "border-b border-transparent"
      }`}
    >
      <div className="container-page flex h-[70px] items-center justify-between gap-4">
        <Link href="/" className="group flex flex-col leading-none">
          <span className="font-display text-[26px] tracking-wide text-white transition-colors group-hover:text-gold-200">
            Frangrant<span className="gold-gradient-text">Aura</span>
          </span>
          <span className="mt-0.5 hidden text-[9px] uppercase tracking-[0.3em] text-ink-500 sm:block">
            {siteConfig.city} · Fragrance House
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`relative rounded-full px-4 py-2 text-[13px] font-medium tracking-wide transition-colors ${
                isActive(item.href)
                  ? "text-gold-200"
                  : "text-ink-300 hover:text-white"
              }`}
            >
              {item.label}
              {isActive(item.href) && (
                <span className="absolute inset-x-4 -bottom-0.5 h-px bg-gradient-to-r from-transparent via-gold-400 to-transparent" />
              )}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <Link
            href="/shop"
            aria-label="Search the collection"
            className="hidden rounded-full p-2.5 text-ink-300 transition hover:bg-white/5 hover:text-white sm:block"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" strokeLinecap="round" />
            </svg>
          </Link>

          <button
            type="button"
            onClick={openCart}
            className="relative rounded-full p-2.5 text-ink-200 transition hover:bg-white/5 hover:text-white"
            aria-label={`Open cart${count > 0 ? `, ${count} item${count === 1 ? "" : "s"}` : ""}`}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
            >
              <path
                d="M6 7h12l-1 12H7L6 7Z"
                strokeLinejoin="round"
                strokeLinecap="round"
              />
              <path
                d="M9.5 7V5.5a2.5 2.5 0 0 1 5 0V7"
                strokeLinecap="round"
              />
            </svg>
            {count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-gold-400 px-1 text-[10px] font-bold text-ink-950">
                {count}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            className="rounded-full p-2.5 text-ink-200 transition hover:bg-white/5 lg:hidden"
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
            >
              {menuOpen ? (
                <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" />
              ) : (
                <path
                  d="M4 7h16M4 12h16M4 17h16"
                  strokeLinecap="round"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav className="border-t border-white/[0.07] bg-ink-950/95 backdrop-blur-xl lg:hidden">
          <div className="container-page flex flex-col py-3">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`border-b border-white/[0.04] py-3 text-sm tracking-wide last:border-0 ${
                  isActive(item.href) ? "text-gold-200" : "text-ink-200"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <Link href="/cart" className="btn-primary mt-4">
              View cart
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
