import type { Metadata } from "next";
import Link from "next/link";
import { isWhatsAppConfigured, siteConfig, whatsappDigits } from "@/lib/config";
import WhatsAppAction from "@/components/WhatsAppAction";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Reach Frangrant Aura in Lekki, Lagos by WhatsApp, email or in person. We'll help you find your signature scent.",
};

const faqs = [
  {
    question: "Are your fragrances authentic?",
    answer:
      "Yes. Every bottle is sourced directly from the house or its authorised distributor, with batch codes intact. We don't sell decants, refills or testers as full bottles.",
  },
  {
    question: "How quickly will my order arrive?",
    answer:
      "Orders placed before 2pm are dispatched the same day within Lagos. Nationwide delivery typically takes 48 hours. Delivery is free once your basket passes ₦150,000.",
  },
  {
    question: "I don't know what to buy. Can you help?",
    answer:
      "That's our favourite question. Message us on WhatsApp with what you currently wear, what you liked and what you didn't, and we'll send three recommendations.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "Card, bank transfer, USSD and Paystack wallet through our secure Paystack checkout, or place your order on WhatsApp and we'll confirm stock before you pay.",
  },
  {
    question: "Do you accept returns?",
    answer:
      "Unopened bottles in their original packaging can be returned within 7 days. If a fragrance arrives damaged or incorrect, we replace it at our cost.",
  },
];

export default function ContactPage() {
  return (
    <div className="container-page py-14">
      <header className="max-w-3xl border-b border-white/[0.07] pb-12">
        <p className="eyebrow mb-4">Get in touch</p>
        <h1 className="font-display text-4xl leading-tight text-white sm:text-5xl">
          Talk to someone who actually wears this stuff
        </h1>
        <p className="mt-6 text-base leading-relaxed text-ink-300">
          Whether you want a recommendation, need to check stock, or have a
          question about an order — WhatsApp is the fastest way to reach us.
        </p>
        <WhatsAppAction className="btn-primary mt-8">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.75-1.64-2.05-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.01-1.04 2.47s1.06 2.86 1.21 3.06c.15.2 2.09 3.19 5.06 4.47.71.3 1.26.49 1.69.62.71.23 1.36.19 1.87.12.57-.09 1.75-.72 2-1.41.25-.69.25-1.28.17-1.41-.07-.13-.27-.2-.57-.35Z" />
            <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.29-1.39a9.9 9.9 0 0 0 4.75 1.21h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.84 9.84 0 0 0 12.04 2Zm0 18.15a8.2 8.2 0 0 1-4.18-1.14l-.3-.18-3.12.82.83-3.04-.19-.31a8.19 8.19 0 0 1-1.26-4.39c0-4.54 3.7-8.24 8.24-8.24 2.2 0 4.27.86 5.82 2.42a8.17 8.17 0 0 1 2.41 5.83c-.01 4.54-3.71 8.23-8.25 8.23Z" />
          </svg>
          Chat on WhatsApp
        </WhatsAppAction>
      </header>

      <div className="mt-14 grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
        <div>
          <h2 className="font-display text-2xl text-white">Where to find us</h2>

          <dl className="mt-7 space-y-7">
            <div>
              <dt className="text-[10px] uppercase tracking-[0.22em] text-gold-300">
                Studio
              </dt>
              <dd className="mt-2 text-sm leading-relaxed text-ink-200">
                {siteConfig.address}
              </dd>
            </div>
            <div>
              <dt className="text-[10px] uppercase tracking-[0.22em] text-gold-300">
                Opening hours
              </dt>
              <dd className="mt-2 text-sm text-ink-200">
                {siteConfig.openingHours}
              </dd>
            </div>
            <div>
              <dt className="text-[10px] uppercase tracking-[0.22em] text-gold-300">
                WhatsApp
              </dt>
              <dd className="mt-2 text-sm text-ink-200">
                {isWhatsAppConfigured ? (
                  `+${whatsappDigits}`
                ) : (
                  <span className="text-ink-500">
                    Not set up yet — add NEXT_PUBLIC_WHATSAPP_NUMBER to go live.
                  </span>
                )}
              </dd>
            </div>
            <div>
              <dt className="text-[10px] uppercase tracking-[0.22em] text-gold-300">
                Email
              </dt>
              <dd className="mt-2 text-sm">
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="text-gold-200 underline-offset-4 transition hover:underline"
                >
                  {siteConfig.email}
                </a>
              </dd>
            </div>
          </dl>

          <Link
            href="/shop"
            className="mt-9 inline-flex text-sm text-gold-200 transition hover:text-gold-100"
          >
            Or browse the collection →
          </Link>
        </div>

        <div>
          <h2 className="font-display text-2xl text-white">
            Frequently asked questions
          </h2>
          <div className="mt-7 space-y-px overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.05]">
            {faqs.map((faq) => (
              <details
                key={faq.question}
                className="group bg-ink-900 px-6 py-5 [&_summary::-webkit-details-marker]:hidden"
              >
                <summary className="flex cursor-pointer items-center justify-between gap-4 list-none">
                  <span className="text-sm font-medium text-white">
                    {faq.question}
                  </span>
                  <span className="shrink-0 text-gold-300 transition-transform duration-200 group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-ink-300">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
