/**
 * Server-only Paystack helpers.
 *
 * This module reads `PAYSTACK_SECRET_KEY`, which must never be exposed to the
 * browser. It is deliberately *not* imported by any client component, and the
 * variable has no `NEXT_PUBLIC_` prefix, so Next.js keeps it out of the
 * client bundle. Only server components and route handlers may import this.
 */

export const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY ?? "";

/** True only when a real (non-placeholder) secret key is present. */
export const hasPaystackSecretKey =
  /^sk_(test|live)_[A-Za-z0-9]{8,}$/.test(paystackSecretKey) &&
  !/x{8,}/i.test(paystackSecretKey);

/** Paystack returns amounts in the smallest currency unit (kobo for NGN). */
const KOBO = 100;

export type PaymentVerification =
  | {
      status: "verified";
      reference: string;
      /** Major units, e.g. Naira. */
      amount: number;
      currency: string;
      email: string;
      channel: string;
      paidAt: string | null;
    }
  | { status: "failed"; reference: string; reason: string }
  | { status: "pending"; reference: string; reason: string }
  | { status: "unavailable"; reference: string; reason: string };

interface PaystackVerifyResponse {
  status?: boolean;
  message?: string;
  data?: {
    status?: string;
    reference?: string;
    amount?: number;
    currency?: string;
    channel?: string;
    paid_at?: string | null;
    customer?: { email?: string };
  };
}

/**
 * Asks Paystack whether a reference was really paid.
 *
 * The result drives what the confirmation page is allowed to claim: only a
 * `verified` response is ever shown as "payment received". This is the piece
 * that makes the receipt trustworthy — the browser cannot fake it by editing
 * the URL, because the amount is read from Paystack's answer rather than from
 * the query string.
 */
export async function verifyPaystackPayment(
  reference: string,
): Promise<PaymentVerification> {
  const ref = reference.trim();

  if (!ref) {
    return { status: "failed", reference: "", reason: "No reference supplied." };
  }

  if (!hasPaystackSecretKey) {
    return {
      status: "unavailable",
      reference: ref,
      reason:
        "Server-side verification is not configured. Add PAYSTACK_SECRET_KEY to verify payments automatically.",
    };
  }

  let response: Response;

  try {
    response = await fetch(
      `https://api.paystack.co/transaction/verify/${encodeURIComponent(ref)}`,
      {
        headers: {
          Authorization: `Bearer ${paystackSecretKey}`,
          "Content-Type": "application/json",
        },
        // Never cache a payment status.
        cache: "no-store",
        signal: AbortSignal.timeout(10_000),
      },
    );
  } catch {
    return {
      status: "unavailable",
      reference: ref,
      reason: "Could not reach Paystack to confirm this payment.",
    };
  }

  if (response.status === 404) {
    return {
      status: "failed",
      reference: ref,
      reason: "Paystack has no record of that reference.",
    };
  }

  if (!response.ok) {
    return {
      status: "unavailable",
      reference: ref,
      reason: `Paystack replied with status ${response.status}.`,
    };
  }

  let body: PaystackVerifyResponse;

  try {
    body = (await response.json()) as PaystackVerifyResponse;
  } catch {
    return {
      status: "unavailable",
      reference: ref,
      reason: "Paystack returned a response we could not read.",
    };
  }

  const data = body.data;

  if (body.status !== true || !data) {
    return {
      status: "unavailable",
      reference: ref,
      reason: body.message ?? "Paystack could not verify that reference.",
    };
  }

  const settledReference = data.reference ?? ref;

  switch (data.status) {
    case "success":
      return {
        status: "verified",
        reference: settledReference,
        amount: (data.amount ?? 0) / KOBO,
        currency: data.currency ?? "NGN",
        email: data.customer?.email ?? "",
        channel: data.channel ?? "",
        paidAt: data.paid_at ?? null,
      };

    case "failed":
      return {
        status: "failed",
        reference: settledReference,
        reason: "Paystack marked this transaction as failed.",
      };

    case "reversed":
      return {
        status: "pending",
        reference: settledReference,
        reason: "This payment was reversed or refunded.",
      };

    default:
      // abandoned | ongoing | pending | processing | queued
      return {
        status: "pending",
        reference: settledReference,
        reason:
          "Paystack has not settled this payment yet. If you completed it, it will confirm shortly.",
      };
  }
}
