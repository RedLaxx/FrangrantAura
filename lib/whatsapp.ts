import { siteConfig, whatsappNumber } from "./config";
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

/** Builds a wa.me deep link carrying a fully formatted order message. */
export function buildWhatsAppUrl(
  order: WhatsAppOrder,
  options: { number?: string; intro?: string } = {},
): string {
  const message = buildOrderMessage(order, options.intro);
  const number = (options.number ?? whatsappNumber).replace(/\D/g, "");
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
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

/** A lighter link used for single-product "ask about this" buttons. */
export function buildProductEnquiryUrl(product: Product): string {
  const message = [
    `Hello ${siteConfig.name}! I'd like to order this fragrance.`,
    "",
    `${product.name} — ${product.sizeMl}ml ${product.concentration}`,
    `Price: ${formatPrice(product.price)}`,
    `Link: ${siteConfig.url}/products/${product.slug}`,
    "",
    "Is this in stock?",
  ].join("\n");

  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
}
