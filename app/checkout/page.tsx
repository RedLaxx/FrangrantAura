import type { Metadata } from "next";
import CheckoutView from "@/components/CheckoutView";

export const metadata: Metadata = {
  title: "Checkout",
  description:
    "Pay securely with Paystack or send your order to us on WhatsApp.",
};

export default function CheckoutPage() {
  return <CheckoutView />;
}
