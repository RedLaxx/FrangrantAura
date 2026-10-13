import type { Metadata } from "next";
import { Suspense } from "react";
import ShopBrowser from "@/components/ShopBrowser";

export const metadata: Metadata = {
  title: "Shop all fragrances",
  description:
    "Browse the full Frangrant Aura collection. Filter by brand, price range, scent family, concentration and size, then check out with Paystack or WhatsApp.",
};

export default function ShopPage() {
  return (
    <Suspense
      fallback={
        <div className="container-page flex min-h-[60vh] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/10 border-t-gold-400" />
        </div>
      }
    >
      <ShopBrowser />
    </Suspense>
  );
}
