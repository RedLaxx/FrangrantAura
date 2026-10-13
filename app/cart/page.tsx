import type { Metadata } from "next";
import CartView from "@/components/CartView";

export const metadata: Metadata = {
  title: "Your cart",
  description: "Review your fragrance selection before checking out.",
};

export default function CartPage() {
  return <CartView />;
}
