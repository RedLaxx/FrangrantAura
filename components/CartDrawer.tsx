"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/format";
import { buildOrderMessage } from "@/lib/whatsapp";
import WhatsAppAction from "./WhatsAppAction";
import { freeDeliveryThreshold } from "@/lib/config";
import ProductImage from "./ProductImage";
import QuantityStepper from "./QuantityStepper";

export default function CartDrawer() {
  const {
    items,
    isOpen,
    closeCart,
    subtotal,
    count,
    setQuantity,
    removeItem,
  } = useCart();

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeCart();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, closeCart]);

  const remainingForFreeDelivery = freeDeliveryThreshold - subtotal;

  return (
    <>
      <div
        onClick={closeCart}
        aria-hidden="true"
        className={`fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        className={`fixed right-0 top-0 z-[70] flex h-full w-full max-w-md flex-col border-l border-white/[0.08] bg-ink-900 shadow-2xl transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <header className="flex items-center justify-between border-b border-white/[0.07] px-6 py-5">
          <div>
            <h2 className="font-display text-2xl text-white">Your cart</h2>
            <p className="mt-0.5 text-xs text-ink-400">
              {count === 0
                ? "No items yet"
                : `${count} item${count === 1 ? "" : "s"}`}
            </p>
          </div>
          <button
            type="button"
            onClick={closeCart}
            aria-label="Close cart"
            className="rounded-full p-2 text-ink-300 transition hover:bg-white/5 hover:text-white"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
            >
              <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" />
            </svg>
          </button>
        </header>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-5 px-8 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full border border-white/10 bg-white/[0.03]">
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
            <p className="text-sm leading-relaxed text-ink-300">
              Your cart is empty. Explore the collection and find your next
              signature scent.
            </p>
            <Link href="/shop" onClick={closeCart} className="btn-primary">
              Browse fragrances
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-6 py-5">
              {subtotal < freeDeliveryThreshold && (
                <div className="mb-5 rounded-xl border border-gold-400/20 bg-gold-400/[0.06] px-4 py-3 text-xs text-gold-100">
                  Add{" "}
                  <strong className="font-semibold">
                    {formatPrice(remainingForFreeDelivery)}
                  </strong>{" "}
                  more to qualify for free delivery.
                </div>
              )}

              <ul className="space-y-5">
                {items.map(({ product, quantity }) => (
                  <li key={product.slug} className="flex gap-4">
                    <Link
                      href={`/products/${product.slug}`}
                      onClick={closeCart}
                      className="relative h-24 w-20 shrink-0 overflow-hidden rounded-xl border border-white/[0.07] bg-ink-900"
                    >
                      <ProductImage
                        src={product.image}
                        alt={product.name}
                        sizes="80px"
                      />
                    </Link>

                    <div className="flex min-w-0 flex-1 flex-col">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <Link
                            href={`/products/${product.slug}`}
                            onClick={closeCart}
                            className="block truncate font-display text-lg text-white hover:text-gold-100"
                          >
                            {product.name}
                          </Link>
                          <p className="mt-0.5 text-[11px] uppercase tracking-wider text-ink-500">
                            {product.sizeMl}ml · {product.concentration}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeItem(product.slug)}
                          aria-label={`Remove ${product.name}`}
                          className="shrink-0 rounded-full p-1 text-ink-500 transition hover:bg-white/5 hover:text-white"
                        >
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                          >
                            <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" />
                          </svg>
                        </button>
                      </div>

                      <div className="mt-auto flex items-center justify-between gap-3 pt-3">
                        <QuantityStepper
                          value={quantity}
                          onChange={(next) => setQuantity(product.slug, next)}
                          size="sm"
                        />
                        <span className="text-sm font-medium text-gold-200">
                          {formatPrice(product.price * quantity)}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <footer className="border-t border-white/[0.07] px-6 py-5">
              <div className="flex items-center justify-between text-sm text-ink-300">
                <span>Subtotal</span>
                <span className="font-display text-2xl text-gold-200">
                  {formatPrice(subtotal)}
                </span>
              </div>
              <p className="mt-1 text-[11px] text-ink-500">
                Delivery and any applicable fees are calculated at checkout.
              </p>

              <div className="mt-5 grid gap-2">
                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="btn-primary w-full"
                >
                  Checkout
                </Link>
                <Link
                  href="/cart"
                  onClick={closeCart}
                  className="btn-secondary w-full"
                >
                  View cart
                </Link>
                <WhatsAppAction
                  message={buildOrderMessage({
                    items,
                    subtotal,
                    delivery: 0,
                    total: subtotal,
                  })}
                  className="btn-ghost w-full border border-white/10 py-3 text-sm"
                >
                  Order on WhatsApp
                </WhatsAppAction>
              </div>
            </footer>
          </>
        )}
      </aside>
    </>
  );
}
