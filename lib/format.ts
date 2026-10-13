import { storeCurrency } from "./config";

const nairaFormatter = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: storeCurrency,
  maximumFractionDigits: 0,
});

/** Formats an amount in Naira, e.g. 78500 -> "₦78,500". */
export function formatPrice(amount: number): string {
  return nairaFormatter.format(Math.round(amount));
}

/** Compact form for filter labels, e.g. 150000 -> "₦150k". */
export function formatPriceCompact(amount: number): string {
  if (amount >= 1_000_000) return `₦${(amount / 1_000_000).toFixed(1)}m`;
  if (amount >= 1_000) {
    const thousands = amount / 1_000;
    const rounded = thousands >= 100 ? Math.round(thousands) : thousands;
    return `₦${rounded}k`;
  }
  return `₦${amount}`;
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function discountPercent(price: number, compareAt?: number): number {
  if (!compareAt || compareAt <= price) return 0;
  return Math.round(((compareAt - price) / compareAt) * 100);
}
