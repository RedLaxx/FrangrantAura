import {
  isWhatsAppConfigured,
  siteConfig,
  whatsappDigits,
} from "./config";
import { formatPrice } from "./format";
import type { CheckoutDetails, Product } from "./types";

export interface WhatsAppOrderItem {
  product: Product;
  quantity: number;
}

export interface WhatsAppOrder {
  items: WhatsAppOrderItem[];
  subtotal: number;
  delivery: number;
  total: number;
  details?: CheckoutDetails;
  reference?: string;
}

/**
 * The one place a `wa.me` URL is assembled.
 *
 * @param message  Optional pre-filled message.
 * @param number   Override; defaults to the configured store number.
 * @returns A wa.me URL, or `null` if no usable number is configured.
 */
export function whatsAppHref(
  message?: string,
  number: string = whatsappDigits,
): string | null {
  const digits = number.replace(/\D/g, "");

  // Respect an explicit override (e.g. a per-brand number) but never emit a
  // link for the store-wide placeholder.
  if (digits !== whatsappDigits && /^\d{8,15}$/.test(digits)) {
    const base = `https://wa.me/${digits}`;
    return message ? `${base}?text=${encodeURIComponent(message)}` : base;
  }

  if (!isWhatsAppConfigured) return null;

  const base = `https://wa.me/${whatsappDigits}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

/** Plain-text order summary sent to WhatsApp. */
export function buildOrderMessage(
  order: WhatsAppOrder,
  intro?: string,
): string {
  const lines: string[] = [];

  lines.push(
    intro ?? `Hello ${siteConfig.name}! I'd like to place an order.`,
    "",
  );

  order.items.forEach(({ product, quantity }, index) => {
    lines.push(
      `${index + 1}. ${product.name} — ${product.sizeMl}ml ${product.concentration}`,
      `   Qty: ${quantity} · ${formatPrice(product.price * quantity)}`,
    );
  });

  lines.push(
    "",
    `Subtotal: ${formatPrice(order.subtotal)}`,
    `Delivery: ${
      order.delivery === 0 ? "Free" : formatPrice(order.delivery)
    }`,
    `Total: ${formatPrice(order.total)}`,
  );

  if (order.details) {
    const { fullName, phone, city, address, note } = order.details;
    lines.push("", "Delivery details:", `Name: ${fullName}`);
    if (phone) lines.push(`Phone: ${phone}`);
    if (city) lines.push(`City: ${city}`);
    if (address) lines.push(`Address: ${address}`);
    if (note) lines.push(`Note: ${note}`);
  }

  if (order.reference) {
    lines.push("", `Reference: ${order.reference}`);
  }

  lines.push("", "Please confirm availability and delivery cost. Thank you!");

  return lines.join("\n");
}

/** Message used by single-product "ask about this" buttons. */
export function productEnquiryMessage(product: Product): string {
  return [
    `Hello ${siteConfig.name}! I'd like to order this fragrance.`,
    "",
    `${product.name} — ${product.sizeMl}ml ${product.concentration}`,
    `Price: ${formatPrice(product.price)}`,
    `Link: ${siteConfig.url}/products/${product.slug}`,
    "",
    "Is this in stock?",
  ].join("\n");
}
