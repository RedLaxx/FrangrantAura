import type { Metadata } from "next";
import Link from "next/link";
import { isTestMode, whatsappNumber } from "@/lib/config";
import { formatPrice } from "@/lib/format";

export const metadata: Metadata = {
  title: "Order received",
  description: "Your Frangrant Aura order has been placed.",
};

interface PageProps {
  searchParams: Promise<{
    ref?: string;
    method?: string;
    amount?: string;
    name?: string;
    email?: string;
    city?: string;
  }>;
}

export default async function ConfirmationPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const reference = params.ref || "—";
  const method = params.method === "whatsapp" ? "WhatsApp" : "Paystack";
  const amount = Number(params.amount);
  const name = params.name?.split(" ")[0] || "there";
  const isWhatsApp = params.method === "whatsapp";

  const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/\D/g, "")}`;

  return (
    <div className="container-page py-16">
      <div className="mx-auto max-w-2xl">
        <div className="grain relative overflow-hidden rounded-3xl border border-gold-400/20 bg-ink-900 px-7 py-14 text-center sm:px-12">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(80%_120%_at_50%_0%,rgba(208,172,76,0.14)_0%,transparent_60%)]"
          />

          <div className="relative">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-gold-400/30 bg-gold-400/10">
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="text-gold-300"
              >
                <path
                  d="m4 12.5 5 5L20 6.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <p className="eyebrow mt-7">
              {isWhatsApp ? "Message sent" : "Payment received"}
            </p>

            <h1 className="mt-4 font-display text-4xl leading-tight text-white sm:text-5xl">
              Thank you, {name}
            </h1>

            <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed text-ink-300 sm:text-base">
              {isWhatsApp
                ? "Your order has been sent to us on WhatsApp. We'll confirm availability and delivery cost in a moment, then share payment details."
                : "Your payment went through and your order is being prepared. A receipt is on its way to your inbox."}
            </p>

            <dl className="mx-auto mt-9 max-w-sm space-y-3 rounded-2xl border border-white/[0.07] bg-white/[0.02] px-6 py-5 text-left text-sm">
              <div className="flex items-center justify-between gap-4">
                <dt className="text-ink-400">Reference</dt>
                <dd className="font-mono text-xs text-gold-200">{reference}</dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt className="text-ink-400">Method</dt>
                <dd className="text-ink-100">{method}</dd>
              </div>
              {Number.isFinite(amount) && amount > 0 && (
                <div className="flex items-center justify-between gap-4">
                  <dt className="text-ink-400">Amount</dt>
                  <dd className="font-display text-xl text-gold-200">
                    {formatPrice(amount)}
                  </dd>
                </div>
              )}
            </dl>

            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              <Link href="/shop" className="btn-primary">
                Continue shopping
              </Link>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary"
              >
                Track this order on WhatsApp
              </a>
            </div>

            <p className="mt-8 text-xs leading-relaxed text-ink-500">
              Delivery in Lagos is same-day for orders placed before 2pm, and
              48 hours nationwide. Reply to our WhatsApp message at any point if
              you need to change something.
            </p>

            {isTestMode && !isWhatsApp && (
              <p className="mt-5 rounded-xl border border-amber-400/25 bg-amber-400/[0.07] px-4 py-3 text-xs text-amber-100">
                This payment was processed with a Paystack{" "}
                <strong className="font-semibold">test</strong> key — no money
                has moved.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
