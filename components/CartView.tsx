"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/format";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { freeDeliveryThreshold } from "@/lib/config";
import ProductImage from "./ProductImage";
import QuantityStepper from "./QuantityStepper";

export default function CartView() {
  const {
    items,
    subtotal,
    delivery,
    total,
    count,
    setQuantity,
    removeItem,
    clear,
    isHydrated,
  } = useCart();

  if (!isHydrated) {
    return (
      <div className="container-page flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/10 border-t-gold-400" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container-page py-16">
        <div className="surface mx-auto flex max-w-lg flex-col items-center px-8 py-20 text-center">
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-white/10 bg-white/[0.03]">
            <svg
              width="26"
              height="26"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.3"
              className="text-ink-400"
            >
              <path d="M6 7h12l-1 12H7L6 7Z" strokeLinejoin="round" />
              <path d="M9.5 7V5.5a2.5 2.5 0 0 1 5 0V7" strokeLinecap="round" />
            </svg>
          </div>
          <h1 className="font-display text-3xl text-white">Your cart is empty</h1>
          <p className="mt-3 text-sm leading-relaxed text-ink-300">
            Start with a bestseller, or filter the collection by budget — we
            stock from ₦21,500 to collector-grade extrait.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/shop" className="btn-primary">
              Browse fragrances
            </Link>
            <Link href="/brands" className="btn-secondary">
              Shop by house
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const remaining = freeDeliveryThreshold - subtotal;

  return (
    <div className="container-page py-12">
      <header className="border-b border-white/[0.07] pb-8">
        <p className="eyebrow mb-3">Your selection</p>
        <h1 className="font-display text-4xl text-white sm:text-5xl">
          Shopping cart
          <span className="ml-3 text-lg text-ink-400">
            ({count} {count === 1 ? "item" : "items"})
          </span>
        </h1>
      </header>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1.6fr_1fr] lg:gap-14">
        <div>
          <ul className="divide-y divide-white/[0.07]">
            {items.map(({ product, quantity }) => (
              <li key={product.slug} className="flex gap-5 py-6 first:pt-0">
                <Link
                  href={`/products/${product.slug}`}
                  className="relative h-32 w-28 shrink-0 overflow-hidden rounded-xl border border-white/[0.07] bg-ink-900"
                >
                  <ProductImage
                    src={product.image}
                    alt={product.name}
                    sizes="112px"
                  />
                </Link>

                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <Link
                        href={`/products/${product.slug}`}
                        className="font-display text-2xl text-white transition hover:text-gold-100"
                      >
                        {product.name}
                      </Link>
                      <p className="mt-1 text-[11px] uppercase tracking-wider text-ink-500">
                        {product.sizeMl}ml · {product.concentration} ·{" "}
                        {product.audience}
                      </p>
                      <p className="mt-2 text-sm text-ink-400">
                        {formatPrice(product.price)} each
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(product.slug)}
                      className="shrink-0 text-xs text-ink-500 underline-offset-4 transition hover:text-white hover:underline"
                    >
                      Remove
                    </button>
                  </div>

                  <div className="mt-auto flex flex-wrap items-center justify-between gap-4 pt-4">
                    <QuantityStepper
                      value={quantity}
                      onChange={(next) => setQuantity(product.slug, next)}
                    />
                    <span className="font-display text-2xl text-gold-200">
                      {formatPrice(product.price * quantity)}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-white/[0.07] pt-6">
            <Link
              href="/shop"
              className="text-sm text-gold-200 transition hover:text-gold-100"
            >
              ← Continue shopping
            </Link>
            <button
              type="button"
              onClick={clear}
              className="text-sm text-ink-500 transition hover:text-white"
            >
              Clear cart
            </button>
          </div>
        </div>

        {/* ---------------------------- Summary ---------------------------- */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="surface p-7">
            <h2 className="font-display text-2xl text-white">Order summary</h2>

            <dl className="mt-6 space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <dt className="text-ink-300">Subtotal</dt>
                <dd className="text-ink-100">{formatPrice(subtotal)}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-ink-300">Delivery</dt>
                <dd className="text-ink-100">
                  {delivery === 0 ? (
                    <span className="text-emerald-300">Free</span>
                  ) : (
                    formatPrice(delivery)
                  )}
                </dd>
              </div>
              <div className="flex items-center justify-between border-t border-white/[0.07] pt-4">
                <dt className="text-base text-white">Total</dt>
                <dd className="font-display text-3xl text-gold-200">
                  {formatPrice(total)}
                </dd>
              </div>
            </dl>

            {remaining > 0 ? (
              <p className="mt-5 rounded-xl border border-gold-400/20 bg-gold-400/[0.06] px-4 py-3 text-xs text-gold-100">
                Add <strong>{formatPrice(remaining)}</strong> more for free
                delivery.
              </p>
            ) : (
              <p className="mt-5 rounded-xl border border-emerald-400/20 bg-emerald-400/[0.06] px-4 py-3 text-xs text-emerald-200">
                You've qualified for free delivery.
              </p>
            )}

            <div className="mt-6 grid gap-3">
              <Link href="/checkout" className="btn-primary w-full">
                Proceed to checkout
              </Link>
              <a
                href={buildWhatsAppUrl({
                  items,
                  subtotal,
                  delivery,
                  total,
                })}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-full border border-emerald-400/25 bg-emerald-400/[0.07] px-7 py-3 text-sm font-medium text-emerald-200 transition hover:border-emerald-400/50 hover:bg-emerald-400/[0.12]"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.75-1.64-2.05-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.01-1.04 2.47s1.06 2.86 1.21 3.06c.15.2 2.09 3.19 5.06 4.47.71.3 1.26.49 1.69.62.71.23 1.36.19 1.87.12.57-.09 1.75-.72 2-1.41.25-.69.25-1.28.17-1.41-.07-.13-.27-.2-.57-.35Z" />
                  <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.29-1.39a9.9 9.9 0 0 0 4.75 1.21h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.84 9.84 0 0 0 12.04 2Zm0 18.15a8.2 8.2 0 0 1-4.18-1.14l-.3-.18-3.12.82.83-3.04-.19-.31a8.19 8.19 0 0 1-1.26-4.39c0-4.54 3.7-8.24 8.24-8.24 2.2 0 4.27.86 5.82 2.42a8.17 8.17 0 0 1 2.41 5.83c-.01 4.54-3.71 8.23-8.25 8.23Z" />
                </svg>
                Order on WhatsApp
              </a>
            </div>

            <p className="mt-5 text-[11px] leading-relaxed text-ink-500">
              Paying by card or transfer? You'll be handed to Paystack's secure
              checkout. Prefer to confirm availability first? Send the same
              order to us on WhatsApp.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
