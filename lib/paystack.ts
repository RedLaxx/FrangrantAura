import { paystackPublicKey, storeCurrency } from "./config";

declare global {
  interface Window {
    PaystackPop?: {
      setup(options: Record<string, unknown>): { openIframe(): void };
    };
  }
}

const SCRIPT_ID = "paystack-inline-js";
const SCRIPT_SRC = "https://js.paystack.co/v1/inline.js";

let scriptPromise: Promise<void> | null = null;

/** Loads the Paystack inline script once per page session. */
export function loadPaystackScript(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise<void>((resolve, reject) => {
    if (window.PaystackPop) {
      resolve();
      return;
    }
    const existing = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () =>
        reject(new Error("Could not reach Paystack")),
      );
      return;
    }
    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.src = SCRIPT_SRC;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Could not reach Paystack"));
    document.head.appendChild(script);
  });

  return scriptPromise;
}

export interface PaystackPayload {
  email: string;
  /** Amount in Naira — converted to kobo for Paystack. */
  amount: number;
  firstName?: string;
  lastName?: string;
  phone?: string;
  metadata?: Record<string, unknown>;
  onSuccess: (reference: string) => void;
  onClose?: () => void;
}

/** Opens the Paystack checkout popup for a single order. */
export async function payWithPaystack({
  email,
  amount,
  firstName,
  lastName,
  phone,
  metadata,
  onSuccess,
  onClose,
}: PaystackPayload): Promise<void> {
  if (!paystackPublicKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY — add it to .env.local (see .env.example).",
    );
  }

  await loadPaystackScript();

  if (!window.PaystackPop) {
    throw new Error("Paystack did not load. Check your connection and retry.");
  }

  const handler = window.PaystackPop.setup({
    key: paystackPublicKey,
    email,
    // Paystack charges in the smallest currency unit (kobo for NGN).
    amount: Math.round(amount) * 100,
    currency: storeCurrency,
    firstname: firstName,
    lastname: lastName,
    phone,
    metadata,
    ref: generateReference(),
    callback: (response: { reference?: string }) => {
      onSuccess(response?.reference ?? "");
    },
    onClose: () => {
      onClose?.();
    },
  });

  handler.openIframe();
}

/** Human-readable, collision-resistant order reference. */
export function generateReference(): string {
  const stamp = Date.now().toString(36).toUpperCase();
  const noise = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `FA-${stamp}-${noise}`;
}
