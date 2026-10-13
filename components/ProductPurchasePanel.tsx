"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import QuantityStepper from "./QuantityStepper";
import { useCart } from "@/lib/cart";
import { buildProductEnquiryUrl } from "@/lib/whatsapp";
import { freeDeliveryThreshold } from "@/lib/config";
import type { Product } from "@/lib/types";

interface ProductPurchasePanelProps {
  product: Product;
}

export default function ProductPurchasePanel({
  product,
}: ProductPurchasePanelProps) {
  const { addItem } = useCart();
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [buying, setBuying] = useState(false);

  const soldOut = product.stock <= 0;

  const buyNow = () => {
    if (soldOut) return;
    addItem(product.slug, quantity);
    setBuying(true);
    router.push("/checkout");
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-4">
        <QuantityStepper
          value={quantity}
          onChange={setQuantity}
          max={Math.min(10, Math.max(product.stock, 1))}
        />
        <span className="text-xs text-ink-400">
          {product.stock > 0 ? (
            product.stock <= 8 ? (
              <span className="text-gold-200">
                Only {product.stock} left in stock
              </span>
            ) : (
              "In stock, ready to ship"
            )
          ) : (
            <span className="text-red-300">Out of stock</span>
          )}
        </span>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={buyNow}
          disabled={soldOut || buying}
          className="btn-primary"
        >
          {soldOut ? "Out of stock" : "Buy now"}
        </button>
        <button
          type="button"
          onClick={() => addItem(product.slug, quantity)}
          disabled={soldOut}
          className="btn-secondary"
        >
          Add to cart
        </button>
      </div>

      <a
        href={buildProductEnquiryUrl(product)}
        target="_blank"
        rel="noopener noreferrer"
        className="flex w-full items-center justify-center gap-2 rounded-full border border-emerald-400/25 bg-emerald-400/[0.07] px-7 py-3 text-sm font-medium text-emerald-200 transition hover:border-emerald-400/50 hover:bg-emerald-400/[0.12]"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.75-1.64-2.05-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.01-1.04 2.47s1.06 2.86 1.21 3.06c.15.2 2.09 3.19 5.06 4.47.71.3 1.26.49 1.69.62.71.23 1.36.19 1.87.12.57-.09 1.75-.72 2-1.41.25-.69.25-1.28.17-1.41-.07-.13-.27-.2-.57-.35Z" />
          <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.29-1.39a9.9 9.9 0 0 0 4.75 1.21h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.84 9.84 0 0 0 12.04 2Zm0 18.15a8.2 8.2 0 0 1-4.18-1.14l-.3-.18-3.12.82.83-3.04-.19-.31a8.19 8.19 0 0 1-1.26-4.39c0-4.54 3.7-8.24 8.24-8.24 2.2 0 4.27.86 5.82 2.42a8.17 8.17 0 0 1 2.41 5.83c-.01 4.54-3.71 8.23-8.25 8.23Z" />
        </svg>
        Order this on WhatsApp
      </a>

      <div className="flex items-start gap-3 rounded-xl border border-white/[0.07] bg-white/[0.02] p-4 text-xs leading-relaxed text-ink-300">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="mt-0.5 shrink-0 text-gold-300"
        >
          <path d="M3 7h11v9H3z" strokeLinejoin="round" />
          <path d="M14 10h4l3 3v3h-7z" strokeLinejoin="round" />
          <circle cx="7" cy="18" r="1.6" />
          <circle cx="17.5" cy="18" r="1.6" />
        </svg>
        <p>
          Free delivery on orders over ₦
          {freeDeliveryThreshold.toLocaleString("en-NG")}. Same-day dispatch
          across Lagos for orders placed before 2pm, 48 hours nationwide.
        </p>
      </div>

      <div className="flex flex-wrap gap-x-5 gap-y-2 pt-1 text-[11px] text-ink-500">
        <span>Authenticity guaranteed</span>
        <span>Secure Paystack checkout</span>
        <Link href="/contact" className="underline-offset-2 hover:underline">
          Need help choosing?
        </Link>
      </div>
    </div>
  );
}
