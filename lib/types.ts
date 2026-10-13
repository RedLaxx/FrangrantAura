/**
 * Core domain types for the Frangrant Aura catalogue.
 *
 * Everything the site renders is derived from these shapes, so swapping the
 * seed data in `lib/products.ts` for a CMS, spreadsheet or API later only
 * means returning the same objects.
 */

export type Concentration =
  | "Eau de Toilette"
  | "Eau de Parfum"
  | "Extrait de Parfum";

export type Audience = "Women" | "Men" | "Unisex";

export type ScentFamily =
  | "Floral"
  | "Woody"
  | "Oriental"
  | "Fresh"
  | "Gourmand"
  | "Fruity";

export interface Brand {
  slug: string;
  name: string;
  tagline: string;
  origin: string;
  founded: number;
  /** Short paragraph shown on the brand page. */
  story: string;
  /** Two or three sentences used in brand cards. */
  excerpt: string;
  /** A colour accent (hex) used for subtle brand-specific flourishes. */
  accent: string;
}

export interface Product {
  slug: string;
  name: string;
  brandSlug: string;
  /** Price in Naira (the store's display + charge currency). */
  price: number;
  /** Optional original price — when present the product is shown as reduced. */
  compareAtPrice?: number;
  sizeMl: number;
  concentration: Concentration;
  audience: Audience;
  families: ScentFamily[];
  topNotes: string[];
  heartNotes: string[];
  baseNotes: string[];
  /** One-line summary used on cards. */
  summary: string;
  /** Longer editorial copy used on the product page. */
  description: string;
  longevity: string;
  sillage: string;
  season: string;
  rating: number;
  reviewCount: number;
  stock: number;
  featured: boolean;
  badge?: "New" | "Bestseller" | "Last few" | "House favourite";
  image: string;
}

export interface CartLine {
  slug: string;
  quantity: number;
}

export interface CheckoutDetails {
  fullName: string;
  email: string;
  phone: string;
  city: string;
  address: string;
  note: string;
}
