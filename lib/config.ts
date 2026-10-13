/**
 * Single source of truth for store configuration.
 *
 * Values come from environment variables (see `.env.example`) so the same
 * code can run with Paystack *test* keys while you build and *live* keys
 * once you launch — no code changes required.
 */

/**
 * Reads an environment variable, treating blank and whitespace-only values as
 * "not set". Without this an accidental `NEXT_PUBLIC_STORE_NAME=` in
 * `.env.local` would blank out the store name instead of falling back.
 */
const env = (value: string | undefined, fallback: string): string =>
  value && value.trim() ? value.trim() : fallback;

export const siteConfig = {
  name: env(process.env.NEXT_PUBLIC_STORE_NAME, "Frangrant Aura"),
  tagline: "Modern fragrance house · Lagos, Nigeria",
  description:
    "Frangrant Aura is a curated fragrance house stocking rare and designer perfumes for women and men. Browse by brand, filter by price, and check out securely with Paystack or by WhatsApp.",
  email: env(process.env.NEXT_PUBLIC_STORE_EMAIL, "hello@frangrantaura.com"),
  url: env(process.env.NEXT_PUBLIC_SITE_URL, "https://frangrantaura.vercel.app"),
  city: "Lagos",
  address: env(
    process.env.NEXT_PUBLIC_STORE_ADDRESS,
    "18 Admiralty Way, Lekki Phase 1, Lagos, Nigeria",
  ),
  openingHours: env(
    process.env.NEXT_PUBLIC_STORE_HOURS,
    "Mon–Sat, 10:00 – 19:00 WAT",
  ),
} as const;

/** Paystack *public* key. Safe to expose to the browser. */
export const paystackPublicKey = env(
  process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
  "",
);

/** ISO currency code charged by Paystack. */
export const storeCurrency = env(process.env.NEXT_PUBLIC_STORE_CURRENCY, "NGN");

/** WhatsApp number in international format, digits only (e.g. 2348012345678). */
export const whatsappNumber = env(
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER,
  "2348000000000",
);

/** The same number, stripped of every non-digit — safe inside `wa.me/…`. */
export const whatsappDigits = whatsappNumber.replace(/\D/g, "");

/**
 * Numbers that ship with the template. They are *not* real WhatsApp accounts,
 * so we refuse to send customers to them — see `isWhatsAppConfigured`.
 */
const PLACEHOLDER_WHATSAPP_NUMBERS = new Set([
  "",
  "2348000000000",
  "2348012345678",
  "234800000000",
]);

/** Matches the all-x placeholders used in `.env.example`. */
const PLACEHOLDER_KEY = /x{8,}/i;

/**
 * True only when a believable, non-placeholder WhatsApp number is configured.
 *
 * Every WhatsApp CTA on the site checks this. When it is false the buttons are
 * rendered inert with an explanation instead of opening a chat with a stranger
 * or with nobody at all — an order that silently goes nowhere is worse than a
 * button that admits it is not ready.
 */
export const isWhatsAppConfigured =
  /^\d{8,15}$/.test(whatsappDigits) &&
  !PLACEHOLDER_WHATSAPP_NUMBERS.has(whatsappDigits);

export const isPaystackConfigured =
  /^pk_(test|live)_[A-Za-z0-9]{8,}$/.test(paystackPublicKey) &&
  !PLACEHOLDER_KEY.test(paystackPublicKey);

/**
 * True while a Paystack *test* key is in use. Drives the "Test mode" banners —
 * swap in a `pk_live_` key and they disappear with no code change.
 */
export const isTestMode = isPaystackConfigured
  ? paystackPublicKey.startsWith("pk_test_")
  : false;

/**
 * Whether `NEXT_PUBLIC_SITE_URL` looks like a real deployment. The bundled
 * default only works while the site is still running locally, and canonical
 * URLs, the sitemap and WhatsApp order links are all built from it.
 */
export const isSiteUrlConfigured = Boolean(
  process.env.NEXT_PUBLIC_SITE_URL?.trim(),
);

export interface ConfigIssue {
  id: "whatsapp" | "paystack" | "site-url";
  /** What is wrong, in one line. */
  title: string;
  /** The env var to set, and what breaks until it is set. */
  detail: string;
}

/**
 * Launch preflight. Anything listed here means the store cannot take orders
 * the way a customer expects, so the setup banner surfaces it on every page
 * until it is fixed.
 *
 * Only `NEXT_PUBLIC_*` values may be inspected here: this module is imported
 * by client components, and secret keys are deliberately invisible to them.
 */
export const configIssues: ConfigIssue[] = [];

if (!isWhatsAppConfigured) {
  configIssues.push({
    id: "whatsapp",
    title: "WhatsApp ordering is switched off",
    detail:
      "Set NEXT_PUBLIC_WHATSAPP_NUMBER to your number in international format, digits only (e.g. 2348012345678). Until then every WhatsApp button is disabled rather than sending customers nowhere.",
  });
}

if (!isPaystackConfigured) {
  configIssues.push({
    id: "paystack",
    title: "Card payments are switched off",
    detail:
      "Set NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY to a pk_test_ or pk_live_ key from your Paystack dashboard. Until then the Paystack option at checkout will not start a payment.",
  });
}

if (!isSiteUrlConfigured) {
  configIssues.push({
    id: "site-url",
    title: "Site URL is still the placeholder",
    detail:
      "Set NEXT_PUBLIC_SITE_URL to your deployed URL so canonical links, the sitemap and WhatsApp order messages point at the right place.",
  });
}


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
