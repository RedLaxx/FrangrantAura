import type { Product } from "./types";
import { getPriceBounds } from "./products";

export type SortKey =
  | "featured"
  | "price-asc"
  | "price-desc"
  | "rating"
  | "name-asc";

export const sortOptions: { value: SortKey; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "rating", label: "Highest rated" },
  { value: "name-asc", label: "Name: A–Z" },
];

export interface FilterState {
  q: string;
  brands: string[];
  families: string[];
  audiences: string[];
  concentrations: string[];
  sizes: number[];
  min: number;
  max: number;
  onSale: boolean;
  inStock: boolean;
  sort: SortKey;
}

const BOUNDS = getPriceBounds();

export const defaultFilters: FilterState = {
  q: "",
  brands: [],
  families: [],
  audiences: [],
  concentrations: [],
  sizes: [],
  min: BOUNDS.min,
  max: BOUNDS.max,
  onSale: false,
  inStock: false,
  sort: "featured",
};

function readList(params: URLSearchParams, key: string): string[] {
  const raw = params.get(key);
  if (!raw) return [];
  return raw
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
}

/** Builds filter state from the URL so results are shareable and bookmarkable. */
export function parseFilters(params: URLSearchParams): FilterState {
  const minParam = Number(params.get("min"));
  const maxParam = Number(params.get("max"));
  const sort = params.get("sort") as SortKey | null;

  return {
    q: params.get("q")?.trim() ?? "",
    brands: readList(params, "brand"),
    families: readList(params, "family"),
    audiences: readList(params, "audience"),
    concentrations: readList(params, "concentration"),
    sizes: readList(params, "size")
      .map(Number)
      .filter((value) => Number.isFinite(value)),
    min: Number.isFinite(minParam) && minParam > 0 ? minParam : BOUNDS.min,
    max: Number.isFinite(maxParam) && maxParam > 0 ? maxParam : BOUNDS.max,
    onSale: params.get("sale") === "1",
    inStock: params.get("stock") === "1",
    sort:
      sort && sortOptions.some((option) => option.value === sort)
        ? sort
        : "featured",
  };
}

export function buildSearchParams(
  state: FilterState,
  overrides: Partial<FilterState> = {},
): string {
  const merged = { ...state, ...overrides };
  const params = new URLSearchParams();

  if (merged.q) params.set("q", merged.q);
  if (merged.brands.length) params.set("brand", merged.brands.join(","));
  if (merged.families.length) params.set("family", merged.families.join(","));
  if (merged.audiences.length) params.set("audience", merged.audiences.join(","));
  if (merged.concentrations.length)
    params.set("concentration", merged.concentrations.join(","));
  if (merged.sizes.length) params.set("size", merged.sizes.join(","));

  const { min: boundMin, max: boundMax } = BOUNDS;
  if (merged.min > boundMin) params.set("min", String(merged.min));
  if (merged.max < boundMax) params.set("max", String(merged.max));

  if (merged.onSale) params.set("sale", "1");
  if (merged.inStock) params.set("stock", "1");
  if (merged.sort !== "featured") params.set("sort", merged.sort);

  return params.toString();
}

export function applyFilters(
  products: Product[],
  state: FilterState,
): Product[] {
  const query = state.q.toLowerCase();

  return products.filter((product) => {
    if (state.brands.length && !state.brands.includes(product.brandSlug))
      return false;
    if (
      state.families.length &&
      !product.families.some((family) => state.families.includes(family))
    )
      return false;
    if (
      state.audiences.length &&
      !state.audiences.includes(product.audience)
    )
      return false;
    if (
      state.concentrations.length &&
      !state.concentrations.includes(product.concentration)
    )
      return false;
    if (state.sizes.length && !state.sizes.includes(product.sizeMl))
      return false;
    if (product.price < state.min || product.price > state.max) return false;
    if (state.onSale && !product.compareAtPrice) return false;
    if (state.inStock && product.stock <= 0) return false;

    if (query) {
      const haystack = [
        product.name,
        product.summary,
        product.concentration,
        product.audience,
        ...product.families,
        ...product.topNotes,
        ...product.heartNotes,
        ...product.baseNotes,
      ]
        .join(" ")
        .toLowerCase();
      if (!haystack.includes(query)) return false;
    }

    return true;
  });
}

export function sortProducts(
  products: Product[],
  sort: SortKey,
): Product[] {
  const sorted = [...products];
  switch (sort) {
    case "price-asc":
      return sorted.sort((a, b) => a.price - b.price);
    case "price-desc":
      return sorted.sort((a, b) => b.price - a.price);
    case "rating":
      return sorted.sort(
        (a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount,
      );
    case "name-asc":
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    case "featured":
    default:
      return sorted.sort(
        (a, b) => Number(b.featured) - Number(a.featured) || b.rating - a.rating,
      );
  }
}

export function countActiveFilters(state: FilterState): number {
  let count = 0;
  count += state.brands.length ? 1 : 0;
  count += state.families.length ? 1 : 0;
  count += state.audiences.length ? 1 : 0;
  count += state.concentrations.length ? 1 : 0;
  count += state.sizes.length ? 1 : 0;
  count += state.min > BOUNDS.min || state.max < BOUNDS.max ? 1 : 0;
  count += state.onSale ? 1 : 0;
  count += state.inStock ? 1 : 0;
  count += state.q ? 1 : 0;
  return count;
}

export const priceBounds = BOUNDS;

/** Round, human-friendly steps for the price slider. */
export const priceStep = 1000;

export const sizeOptions = [50, 75, 100];
