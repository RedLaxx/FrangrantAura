import type { Metadata } from "next";
import Link from "next/link";
import { isTestMode } from "@/lib/config";
import { formatPrice } from "@/lib/format";
import {
  verifyPaystackPayment,
  type PaymentVerification,
} from "@/lib/paystack-server";
import WhatsAppAction from "@/components/WhatsAppAction";

export const metadata: Metadata = {
  title: "Order received",
  description: "Your Frangrant Aura order.",
  robots: { index: false, follow: false },
};

interface PageProps {
  searchParams: Promise<{
    ref?: string;
    method?: string;
    /** Only used for the WhatsApp greeting. Never trusted for money. */
    name?: string;
  }>;
}

/** Naira unless Paystack charged something else. */
function formatAmount(amount: number, currency: string): string {
  return currency === "NGN" ? formatPrice(amount) : `${amount} ${currency}`;
}

export default async function ConfirmationPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const reference = params.ref?.trim() ?? "";
  const isWhatsApp = params.method === "whatsapp";
  const name = params.name?.trim().split(/\s+/)[0]?.slice(0, 40) || "there";

  // A card payment is only ever called "received" after Paystack itself says
  // so, server-side. Nothing about the amount comes from the URL.
  const verification: PaymentVerification | null =
    !isWhatsApp && reference ? await verifyPaystackPayment(reference) : null;

  const panel = isWhatsApp
    ? {
        eyebrow: "Message sent",
        title: `Thank you, ${name}`,
        body: "Your order has been sent to us on WhatsApp. We'll confirm availability and delivery cost in a moment, then share payment details.",
        tone: "neutral" as const,
      }
    : describePayment(verification, name);

  return (
    <div className="container-page py-16">
      <div className="mx-auto max-w-2xl">
        <div className="grain relative overflow-hidden rounded-3xl border border-gold-400/20 bg-ink-900 px-7 py-14 text-center sm:px-12">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(80%_120%_at_50%_0%,rgba(208,172,76,0.14)_0%,transparent_60%)]"
          />

          <div className="relative">
            <StatusIcon tone={panel.tone} />

            <p className="eyebrow mt-7">{panel.eyebrow}</p>

            <h1 className="mt-4 font-display text-4xl leading-tight text-white sm:text-5xl">
              {panel.title}
            </h1>

            <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed text-ink-300 sm:text-base">
              {panel.body}
            </p>

            <dl className="mx-auto mt-9 max-w-sm space-y-3 rounded-2xl border border-white/[0.07] bg-white/[0.02] px-6 py-5 text-left text-sm">
              <div className="flex items-center justify-between gap-4">
                <dt className="text-ink-400">Reference</dt>
                <dd className="font-mono text-xs text-gold-200">
                  {reference || "—"}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt className="text-ink-400">Method</dt>
                <dd className="text-ink-100">
                  {isWhatsApp ? "WhatsApp" : "Paystack"}
                </dd>
              </div>

              {verification?.status === "verified" && (
                <>
                  <div className="flex items-center justify-between gap-4">
                    <dt className="text-ink-400">Amount paid</dt>
                    <dd className="font-display text-xl text-gold-200">
                      {formatAmount(verification.amount, verification.currency)}
                    </dd>
                  </div>
                  {verification.channel && (
                    <div className="flex items-center justify-between gap-4">
                      <dt className="text-ink-400">Paid with</dt>
                      <dd className="capitalize text-ink-100">
                        {verification.channel}
                      </dd>
                    </div>
                  )}
                </>
              )}
            </dl>

            {verification?.status === "pending" && (
              <p className="mx-auto mt-6 max-w-md rounded-xl border border-amber-400/25 bg-amber-400/[0.07] px-4 py-3 text-xs leading-relaxed text-amber-100">
                {verification.reason}{" "}
                <Link
                  href={refreshHref(reference, params.name)}
                  className="underline underline-offset-2"
                >
                  Check again
                </Link>
                .
              </p>
            )}

            {verification?.status === "unavailable" && (
              <p className="mx-auto mt-6 max-w-md rounded-xl border border-amber-400/25 bg-amber-400/[0.07] px-4 py-3 text-xs leading-relaxed text-amber-100">
                {verification.reason} Your reference is{" "}
                <strong className="font-mono">{reference || "—"}</strong> — send
                it to us and we'll confirm your payment manually.
              </p>
            )}

            {verification?.status === "failed" && (
              <p className="mx-auto mt-6 max-w-md rounded-xl border border-red-400/25 bg-red-400/[0.07] px-4 py-3 text-xs leading-relaxed text-red-200">
                {verification.reason} If money left your account, contact us with
                the reference below and we'll sort it out.
              </p>
            )}

            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              <Link href="/shop" className="btn-primary">
                Continue shopping
              </Link>
              <WhatsAppAction
                message={`Hello! I'm checking on my order — reference ${reference || "—"}.`}
                className="btn-secondary"
              >
                Track this order on WhatsApp
              </WhatsAppAction>
            </div>

            <p className="mt-8 text-xs leading-relaxed text-ink-500">
              Delivery in Lagos is same-day for orders placed before 2pm, and 48
              hours nationwide. Reply to our WhatsApp message at any point if you
              need to change something.
            </p>

            {isTestMode && verification?.status === "verified" && (
              <p className="mt-5 rounded-xl border border-amber-400/25 bg-amber-400/[0.07] px-4 py-3 text-xs text-amber-100">
                This payment was processed with a Paystack{" "}
                <strong className="font-semibold">test</strong> key — no money
                has moved.
              </p>
            )}

            {verification?.status === "verified" && (
              <p className="mt-5 text-[11px] leading-relaxed text-ink-500">
                Confirmed directly with Paystack
                {verification.email ? ` · receipt sent to ${verification.email}` : ""}
                . Keep this reference for any follow-up.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/** Rebuilds this page's URL for a manual re-check. */
function refreshHref(reference: string, name?: string): string {
  const params = new URLSearchParams({ ref: reference, method: "paystack" });
  if (name) params.set("name", name);
  return `/checkout/confirmation?${params.toString()}`;
}

function describePayment(
  verification: PaymentVerification | null,
  name: string,
): {
  eyebrow: string;
  title: string;
  body: string;
  tone: "success" | "pending" | "failed";
} {
  if (!verification) {
    return {
      eyebrow: "Order not found",
      title: "We couldn't find that order",
      body: "This page needs the reference we gave you at checkout. If you have just paid, check your email for the receipt, or message us and we'll find your order.",
      tone: "failed",
    };
  }

  switch (verification.status) {
    case "verified":
      return {
        eyebrow: "Payment received",
        title: `Thank you, ${name}`,
        body: "Your payment went through and your order is being prepared. A receipt is on its way to your inbox.",
        tone: "success",
      };

    case "pending":
      return {
        eyebrow: "Payment pending",
        title: `Thank you, ${name}`,
        body: "We can see your order but Paystack hasn't settled the payment yet. Nothing else is needed from you — this page updates itself the moment it clears.",
        tone: "pending",
      };

    case "unavailable":
      return {
        eyebrow: "Awaiting confirmation",
        title: `Thank you, ${name}`,
        body: "Your order is with us. We're confirming the payment on our side and will email you the moment it clears.",
        tone: "pending",
      };

    case "failed":
    default:
      return {
        eyebrow: "Payment not confirmed",
        title: "We couldn't confirm this payment",
        body: "No completed payment matches this reference. You have not been charged for an order we can see — try checking out again, or message us and we'll help.",
        tone: "failed",
      };
  }
}

function StatusIcon({ tone }: { tone: "success" | "pending" | "failed" | "neutral" }) {
  const styles = {
    success: "border-gold-400/30 bg-gold-400/10 text-gold-300",
    pending: "border-amber-400/30 bg-amber-400/10 text-amber-200",
    failed: "border-red-400/30 bg-red-400/10 text-red-200",
    neutral: "border-gold-400/30 bg-gold-400/10 text-gold-300",
  }[tone];

  return (
    <div
      className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full border ${styles}`}
    >
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        {tone === "failed" ? (
          <>
            <path d="M12 7.5v6" strokeLinecap="round" />
            <circle cx="12" cy="17" r="0.9" fill="currentColor" stroke="none" />
            <circle cx="12" cy="12" r="9" strokeLinejoin="round" />
          </>
        ) : tone === "pending" ? (
          <>
            <circle cx="12" cy="12" r="9" strokeLinejoin="round" />
            <path d="M12 7.5V12l3 2" strokeLinecap="round" strokeLinejoin="round" />
          </>
        ) : (
          <path d="m4 12.5 5 5L20 6.5" strokeLinecap="round" strokeLinejoin="round" />
        )}
      </svg>
    </div>
  );
}
