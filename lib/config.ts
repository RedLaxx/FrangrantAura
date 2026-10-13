/**
 * Single source of truth for store configuration.
 *
 * Values come from environment variables (see `.env.example`) so the same
 * code can run with Paystack *test* keys while you build and *live* keys
 * once you launch — no code changes required.
 */

export const siteConfig = {
  name: process.env.NEXT_PUBLIC_STORE_NAME ?? "Frangrant Aura",
  tagline: "Modern fragrance house · Lagos, Nigeria",
  description:
    "Frangrant Aura is a curated fragrance house stocking rare and designer perfumes for women and men. Browse by brand, filter by price, and check out securely with Paystack or by WhatsApp.",
  email: process.env.NEXT_PUBLIC_STORE_EMAIL ?? "hello@frangrantaura.com",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://frangrantaura.vercel.app",
  city: "Lagos",
  address: "18 Admiralty Way, Lekki Phase 1, Lagos, Nigeria",
  openingHours: "Mon–Sat, 10:00 – 19:00 WAT",
} as const;

/** Paystack *public* key. Safe to expose to the browser. */
export const paystackPublicKey =
  process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY ?? "";

/** ISO currency code charged by Paystack. */
export const storeCurrency = process.env.NEXT_PUBLIC_STORE_CURRENCY ?? "NGN";

/** WhatsApp number in international format, digits only (e.g. 2348012345678). */
export const whatsappNumber =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "2348000000000";

export const isPaystackConfigured =
  paystackPublicKey.startsWith("pk_test_") ||
  paystackPublicKey.startsWith("pk_live_");

export const isTestMode = paystackPublicKey.startsWith("pk_test_");

/** Flat delivery fee in Naira. Set to 0 for free delivery. */
export const deliveryFee = 3500;

/** Free delivery once the subtotal reaches this amount. */
export const freeDeliveryThreshold = 150000;

/** Preset price buckets surfaced as quick links across the site. */
export const priceBuckets = [
  { id: "under-50k", label: "Under ₦50,000", min: 0, max: 50000 },
  { id: "50k-100k", label: "₦50,000 – ₦100,000", min: 50000, max: 100000 },
  { id: "100k-150k", label: "₦100,000 – ₦150,000", min: 100000, max: 150000 },
  { id: "150k-plus", label: "₦150,000 & above", min: 150000, max: Infinity },
] as const;
