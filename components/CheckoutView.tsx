"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/format";
import { buildWhatsAppUrl, type WhatsAppOrder } from "@/lib/whatsapp";
import { generateReference, payWithPaystack } from "@/lib/paystack";
import {
  isPaystackConfigured,
  isTestMode,
  siteConfig,
} from "@/lib/config";
import type { CheckoutDetails } from "@/lib/types";
import ProductImage from "./ProductImage";

const emptyDetails: CheckoutDetails = {
  fullName: "",
  email: "",
  phone: "",
  city: "Lagos",
  address: "",
  note: "",
};

type Errors = Partial<Record<keyof CheckoutDetails, string>>;

export default function CheckoutView() {
  const router = useRouter();
  const { items, subtotal, delivery, total, count, clear, isHydrated } =
    useCart();

  const [details, setDetails] = useState<CheckoutDetails>(emptyDetails);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<
    "idle" | "processing" | "error" | "whatsapp-sent"
  >("idle");
  const [message, setMessage] = useState("");
  const [reference, setReference] = useState<string | null>(null);

  const update = (key: keyof CheckoutDetails, value: string) => {
    setDetails((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  };

  const validate = (): boolean => {
    const next: Errors = {};
    if (!details.fullName.trim()) next.fullName = "Please tell us your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(details.email.trim()))
      next.email = "Enter a valid email for your receipt.";
    if (details.phone.replace(/\D/g, "").length < 8)
      next.phone = "Enter a phone number we can reach you on.";
    if (!details.city.trim()) next.city = "Which city should we deliver to?";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const buildOrder = (ref: string): WhatsAppOrder => ({
    items,
    subtotal,
    delivery,
    total,
    details,
    reference: ref,
  });

  const handlePaystack = async () => {
    if (!validate()) return;

    if (!isPaystackConfigured) {
      setStatus("error");
      setMessage(
        "Paystack is not configured yet. Add NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY to .env.local, or place this order on WhatsApp instead.",
      );
      return;
    }

    const ref = generateReference();
    setReference(ref);
    setStatus("processing");
    setMessage("");

    const [firstName, ...rest] = details.fullName.trim().split(/\s+/);

    try {
      await payWithPaystack({
        email: details.email.trim(),
        amount: total,
        firstName,
        lastName: rest.join(" ") || undefined,
        phone: details.phone.trim(),
        metadata: {
          reference: ref,
          custom_fields: [
            {
              display_name: "Order reference",
              variable_name: "order_reference",
              value: ref,
            },
            {
              display_name: "Delivery city",
              variable_name: "delivery_city",
              value: details.city,
            },
            {
              display_name: "Delivery address",
              variable_name: "delivery_address",
              value: details.address || "To be confirmed",
            },
            {
              display_name: "Items",
              variable_name: "items",
              value: items
                .map(
                  ({ product, quantity }) =>
                    `${product.name} (${product.sizeMl}ml) x${quantity}`,
                )
                .join(", "),
            },
          ],
        },
        onSuccess: (paidReference) => {
          const finalRef = paidReference || ref;
          const params = new URLSearchParams({
            ref: finalRef,
            method: "paystack",
            amount: String(total),
            name: details.fullName.trim(),
            email: details.email.trim(),
            city: details.city.trim(),
          });
          clear();
          router.push(`/checkout/confirmation?${params.toString()}`);
        },
        onClose: () => {
          setStatus("idle");
        },
      });
    } catch (error) {
      setStatus("error");
      setMessage(
        error instanceof Error
          ? error.message
          : "We couldn't reach Paystack. Please try again or order on WhatsApp.",
      );
    }
  };

  const handleWhatsApp = () => {
    if (!validate()) return;
    const ref = reference ?? generateReference();
    setReference(ref);
    const url = buildWhatsAppUrl(buildOrder(ref));
    window.open(url, "_blank", "noopener,noreferrer");
    setStatus("whatsapp-sent");
  };

  if (!isHydrated) {
    return (
      <div className="container-page flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/10 border-t-gold-400" />
      </div>
    );
  }

  if (items.length === 0 && status !== "whatsapp-sent") {
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
          <h1 className="font-display text-3xl text-white">
            Nothing to check out
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-ink-300">
            Add a fragrance to your cart first, then come back here to choose
            how you'd like to pay.
          </p>
          <Link href="/shop" className="btn-primary mt-8">
            Browse fragrances
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-page py-12">
      <header className="border-b border-white/[0.07] pb-8">
        <p className="eyebrow mb-3">Almost there</p>
        <h1 className="font-display text-4xl text-white sm:text-5xl">
          Checkout
        </h1>
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-ink-300">
          Choose how you'd like to pay. Pay with card, bank transfer or USSD
          through Paystack, or send the order to us on WhatsApp and we'll
          confirm stock and delivery cost before you pay.
        </p>
      </header>

      {isTestMode && (
        <div className="mt-8 flex flex-wrap items-center gap-3 rounded-xl border border-amber-400/25 bg-amber-400/[0.07] px-5 py-4 text-sm text-amber-100">
          <span className="rounded-full bg-amber-400/20 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider">
            Test mode
          </span>
          Paystack is running on a <strong className="font-semibold">test</strong>{" "}
          key. Use Paystack's test card 4084 0840 8408 4081 to run a full
          payment without moving real money.
        </div>
      )}

      <div className="mt-10 grid gap-10 lg:grid-cols-[1.35fr_1fr] lg:gap-14">
        {/* ----------------------------- Form ------------------------------ */}
        <section>
          <h2 className="font-display text-2xl text-white">Delivery details</h2>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <Field
              label="Full name"
              value={details.fullName}
              onChange={(value) => update("fullName", value)}
              error={errors.fullName}
              placeholder="Amara Okonkwo"
              autoComplete="name"
            />
            <Field
              label="Email"
              type="email"
              value={details.email}
              onChange={(value) => update("email", value)}
              error={errors.email}
              placeholder="you@example.com"
              autoComplete="email"
              hint="Your receipt and tracking updates go here."
            />
            <Field
              label="Phone number"
              type="tel"
              value={details.phone}
              onChange={(value) => update("phone", value)}
              error={errors.phone}
              placeholder="0801 234 5678"
              autoComplete="tel"
            />
            <Field
              label="City"
              value={details.city}
              onChange={(value) => update("city", value)}
              error={errors.city}
              placeholder="Lagos"
              autoComplete="address-level2"
            />
            <div className="sm:col-span-2">
              <Field
                label="Delivery address"
                value={details.address}
                onChange={(value) => update("address", value)}
                error={errors.address}
                placeholder="Street, area, landmark"
                autoComplete="street-address"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="field-label" htmlFor="note">
                Order note (optional)
              </label>
              <textarea
                id="note"
                rows={3}
                value={details.note}
                onChange={(event) => update("note", event.target.value)}
                placeholder="Gift wrap, delivery timing, anything else…"
                className="field resize-none"
              />
            </div>
          </div>

          {/* --------------------------- Payment --------------------------- */}
          <h2 className="mt-12 font-display text-2xl text-white">
            Choose payment method
          </h2>

          <div className="mt-6 space-y-3">
            <PaymentOption
              title="Pay with Paystack"
              subtitle="Card, bank transfer, USSD or Paystack wallet"
              onClick={handlePaystack}
              disabled={status === "processing"}
              busy={status === "processing"}
              primary
            />

            <PaymentOption
              title="Order on WhatsApp"
              subtitle="We'll confirm stock and delivery, then share payment details"
              onClick={handleWhatsApp}
              disabled={status === "processing"}
              accent="whatsapp"
            />
          </div>

          {status === "error" && message && (
            <p className="mt-5 rounded-xl border border-red-400/25 bg-red-400/[0.07] px-5 py-4 text-sm text-red-200">
              {message}
            </p>
          )}

          {status === "whatsapp-sent" && (
            <div className="mt-5 rounded-xl border border-emerald-400/25 bg-emerald-400/[0.07] px-5 py-4 text-sm text-emerald-100">
              <p className="font-medium">WhatsApp opened in a new tab.</p>
              <p className="mt-1.5 text-emerald-200/80">
                If nothing opened, your browser may have blocked the popup —
                just hit the button again. Your reference is{" "}
                <strong className="font-semibold">{reference}</strong>.
              </p>
            </div>
          )}

          <div className="mt-8 flex items-start gap-3 text-xs leading-relaxed text-ink-500">
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="mt-0.5 shrink-0 text-gold-300"
            >
              <rect x="4" y="10" width="16" height="10" rx="2" />
              <path d="M8 10V7a4 4 0 0 1 8 0v3" />
            </svg>
            <p>
              Your details are only used to fulfil this order. Card details
              never touch our servers — payments are handled end-to-end by{" "}
              {""}Paystack, a PCI-DSS certified processor. Questions?{" "}
              <a
                href={`mailto:${siteConfig.email}`}
                className="text-gold-300 underline-offset-2 hover:underline"
              >
                {siteConfig.email}
              </a>
            </p>
          </div>
        </section>

        {/* ---------------------------- Summary ---------------------------- */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="surface p-7">
            <h2 className="font-display text-2xl text-white">
              Order summary
              <span className="ml-2 text-sm text-ink-400">
                ({count} {count === 1 ? "item" : "items"})
              </span>
            </h2>

            <ul className="mt-6 space-y-4">
              {items.map(({ product, quantity }) => (
                <li key={product.slug} className="flex items-center gap-3">
                  <div className="relative h-14 w-12 shrink-0 overflow-hidden rounded-lg border border-white/[0.07] bg-ink-900">
                    <ProductImage
                      src={product.image}
                      alt={product.name}
                      sizes="48px"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm text-white">
                      {product.name}
                    </p>
                    <p className="text-[11px] text-ink-500">
                      {product.sizeMl}ml · ×{quantity}
                    </p>
                  </div>
                  <span className="text-sm text-gold-200">
                    {formatPrice(product.price * quantity)}
                  </span>
                </li>
              ))}
            </ul>

            <dl className="mt-6 space-y-3 border-t border-white/[0.07] pt-5 text-sm">
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

            <Link
              href="/cart"
              className="mt-6 block text-center text-xs text-gold-300 underline-offset-4 transition hover:underline"
            >
              Edit cart
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  error,
  hint,
  type = "text",
  placeholder,
  autoComplete,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  hint?: string;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
}) {
  const id = label.toLowerCase().replace(/[^a-z]+/g, "-");
  return (
    <div>
      <label className="field-label" htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        aria-invalid={Boolean(error)}
        className={`field ${error ? "border-red-400/50" : ""}`}
      />
      {error ? (
        <p className="mt-1.5 text-xs text-red-300">{error}</p>
      ) : (
        hint && <p className="mt-1.5 text-xs text-ink-500">{hint}</p>
      )}
    </div>
  );
}

function PaymentOption({
  title,
  subtitle,
  onClick,
  disabled,
  busy,
  primary,
  accent,
}: {
  title: string;
  subtitle: string;
  onClick: () => void;
  disabled?: boolean;
  busy?: boolean;
  primary?: boolean;
  accent?: "whatsapp";
}) {
  const isWhatsApp = accent === "whatsapp";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`group flex w-full items-center justify-between gap-4 rounded-2xl border px-6 py-5 text-left transition-all disabled:opacity-60 ${
        isWhatsApp
          ? "border-emerald-400/25 bg-emerald-400/[0.06] hover:border-emerald-400/50 hover:bg-emerald-400/[0.1]"
          : "border-gold-400/30 bg-gold-400/[0.06] hover:border-gold-400/60 hover:bg-gold-400/[0.1]"
      }`}
    >
      <span className="flex items-center gap-4">
        <span
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
            isWhatsApp
              ? "bg-emerald-400/15 text-emerald-200"
              : "bg-gold-400/15 text-gold-200"
          }`}
        >
          {busy ? (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-current" />
          ) : isWhatsApp ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.75-1.64-2.05-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.01-1.04 2.47s1.06 2.86 1.21 3.06c.15.2 2.09 3.19 5.06 4.47.71.3 1.26.49 1.69.62.71.23 1.36.19 1.87.12.57-.09 1.75-.72 2-1.41.25-.69.25-1.28.17-1.41-.07-.13-.27-.2-.57-.35Z" />
              <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.29-1.39a9.9 9.9 0 0 0 4.75 1.21h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.84 9.84 0 0 0 12.04 2Zm0 18.15a8.2 8.2 0 0 1-4.18-1.14l-.3-.18-3.12.82.83-3.04-.19-.31a8.19 8.19 0 0 1-1.26-4.39c0-4.54 3.7-8.24 8.24-8.24 2.2 0 4.27.86 5.82 2.42a8.17 8.17 0 0 1 2.41 5.83c-.01 4.54-3.71 8.23-8.25 8.23Z" />
            </svg>
          ) : (
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
            >
              <rect x="3" y="6" width="18" height="12" rx="2.5" />
              <path d="M3 10h18" />
              <path d="M7 14h4" strokeLinecap="round" />
            </svg>
          )}
        </span>
        <span>
          <span className="block text-sm font-medium text-white">
            {title}
            {primary && (
              <span className="ml-2 rounded-full bg-gold-400/20 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-gold-200">
                Recommended
              </span>
            )}
          </span>
          <span className="mt-0.5 block text-xs text-ink-400">{subtitle}</span>
        </span>
      </span>
      <span
        className={`shrink-0 text-sm transition-transform duration-200 group-hover:translate-x-1 ${
          isWhatsApp ? "text-emerald-300" : "text-gold-300"
        }`}
      >
        →
      </span>
    </button>
  );
}
