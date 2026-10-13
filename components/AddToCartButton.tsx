"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart";

interface AddToCartButtonProps {
  slug: string;
  quantity?: number;
  label?: string;
  className?: string;
  fullWidth?: boolean;
  variant?: "primary" | "secondary";
}

export default function AddToCartButton({
  slug,
  quantity = 1,
  label = "Add to cart",
  className = "",
  fullWidth = false,
  variant = "primary",
}: AddToCartButtonProps) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const base =
    variant === "primary" ? "btn-primary" : "btn-secondary";

  return (
    <button
      type="button"
      onClick={() => {
        addItem(slug, quantity);
        setAdded(true);
        window.setTimeout(() => setAdded(false), 1600);
      }}
      className={`${base} ${fullWidth ? "w-full" : ""} ${className}`}
    >
      {added ? (
        <>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
          >
            <path d="m4 12.5 5 5L20 6.5" strokeLinecap="round" />
          </svg>
          Added
        </>
      ) : (
        <>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <path d="M6 7h12l-1 12H7L6 7Z" strokeLinejoin="round" />
            <path d="M9.5 7V5.5a2.5 2.5 0 0 1 5 0V7" strokeLinecap="round" />
          </svg>
          {label}
        </>
      )}
    </button>
  );
}
