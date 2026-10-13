"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { CartLine, Product } from "./types";
import { getProductBySlug } from "./products";
import {
  deliveryFee,
  freeDeliveryThreshold,
} from "./config";

const STORAGE_KEY = "frangrant-aura-cart-v1";

interface CartContextValue {
  /** Lines are hydrated with their product data for rendering. */
  lines: CartLine[];
  items: { product: Product; quantity: number }[];
  isOpen: boolean;
  isHydrated: boolean;
  count: number;
  subtotal: number;
  delivery: number;
  total: number;
  addItem: (slug: string, quantity?: number) => void;
  removeItem: (slug: string) => void;
  setQuantity: (slug: string, quantity: number) => void;
  clear: () => void;
  openCart: () => void;
  closeCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // Read the persisted cart once on mount so server and client markup match.
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as CartLine[];
        if (Array.isArray(parsed)) {
          setLines(
            parsed.filter(
              (line) =>
                line &&
                typeof line.slug === "string" &&
                getProductBySlug(line.slug) &&
                Number.isFinite(line.quantity) &&
                line.quantity > 0,
            ),
          );
        }
      }
    } catch {
      // Corrupt or unavailable storage — start with an empty cart.
    }
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      // Ignore quota / private-mode failures.
    }
  }, [lines, isHydrated]);

  const addItem = useCallback((slug: string, quantity = 1) => {
    setLines((current) => {
      const existing = current.find((line) => line.slug === slug);
      if (existing) {
        return current.map((line) =>
          line.slug === slug
            ? { ...line, quantity: Math.min(line.quantity + quantity, 10) }
            : line,
        );
      }
      return [...current, { slug, quantity: Math.min(quantity, 10) }];
    });
    setIsOpen(true);
  }, []);

  const removeItem = useCallback((slug: string) => {
    setLines((current) => current.filter((line) => line.slug !== slug));
  }, []);

  const setQuantity = useCallback((slug: string, quantity: number) => {
    setLines((current) =>
      quantity <= 0
        ? current.filter((line) => line.slug !== slug)
        : current.map((line) =>
            line.slug === slug
              ? { ...line, quantity: Math.min(quantity, 10) }
              : line,
          ),
    );
  }, []);

  const clear = useCallback(() => setLines([]), []);
  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const value = useMemo<CartContextValue>(() => {
    const items = lines
      .map((line) => {
        const product = getProductBySlug(line.slug);
        return product ? { product, quantity: line.quantity } : null;
      })
      .filter((entry): entry is { product: Product; quantity: number } =>
        Boolean(entry),
      );

    const subtotal = items.reduce(
      (sum, entry) => sum + entry.product.price * entry.quantity,
      0,
    );
    const delivery =
      subtotal === 0 || subtotal >= freeDeliveryThreshold ? 0 : deliveryFee;

    return {
      lines,
      items,
      isOpen,
      isHydrated,
      count: items.reduce((sum, entry) => sum + entry.quantity, 0),
      subtotal,
      delivery,
      total: subtotal + delivery,
      addItem,
      removeItem,
      setQuantity,
      clear,
      openCart,
      closeCart,
    };
  }, [
    lines,
    isOpen,
    isHydrated,
    addItem,
    removeItem,
    setQuantity,
    clear,
    openCart,
    closeCart,
  ]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used inside a <CartProvider>");
  }
  return context;
}
