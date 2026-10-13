"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ProductCard from "./ProductCard";
import FilterPanel from "./FilterPanel";
import { brands, products } from "@/lib/products";
import {
  applyFilters,
  buildSearchParams,
  countActiveFilters,
  defaultFilters,
  parseFilters,
  sortOptions,
  sortProducts,
  type FilterState,
  type SortKey,
} from "@/lib/filters";
import { formatPrice } from "@/lib/format";
import { getBrandBySlug } from "@/lib/products";

export default function ShopBrowser() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const filters = useMemo(
    () => parseFilters(new URLSearchParams(searchParams.toString())),
    [searchParams],
  );

  const [sheetOpen, setSheetOpen] = useState(false);
  const [searchDraft, setSearchDraft] = useState(filters.q);

  const results = useMemo(
    () => sortProducts(applyFilters(products, filters), filters.sort),
    [filters],
  );

  const activeCount = countActiveFilters(filters);

  const push = useCallback(
    (overrides: Partial<FilterState>) => {
      const query = buildSearchParams(filters, overrides);
      router.push(query ? `/shop?${query}` : "/shop", { scroll: false });
    },
    [filters, router],
  );

  const toggle = useCallback(
    <K extends keyof FilterState>(key: K, value: never) => {
      const current = filters[key] as unknown as string[];
      const next = current.includes(value)
        ? current.filter((entry) => entry !== value)
        : [...current, value];
      push({ [key]: next } as unknown as Partial<FilterState>);
    },
    [filters, push],
  );

  const toggleFlag = useCallback(
    (key: "onSale" | "inStock") => {
      push({ [key]: !filters[key] } as Partial<FilterState>);
    },
    [filters, push],
  );

  const clearAll = useCallback(() => {
    router.push("/shop", { scroll: false });
  }, [router]);

  const lowPrice = results.length
    ? Math.min(...results.map((product) => product.price))
    : 0;

  const panel = (
    <FilterPanel
      filters={filters}
      onToggle={toggle as never}
      onToggleFlag={toggleFlag}
      onPriceChange={(value) => push({ min: value.min, max: value.max })}
    />
  );

  return (
    <div className="container-page pb-24 pt-10">
      {/* ------------------------------- Header ------------------------------ */}
      <div className="flex flex-col gap-4 border-b border-white/[0.07] pb-8 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="eyebrow mb-3">The collection</p>
          <h1 className="font-display text-4xl text-white sm:text-5xl">
            {filters.q ? `Results for “${filters.q}”` : "All fragrances"}
          </h1>
          <p className="mt-3 text-sm text-ink-300">
            {results.length} {results.length === 1 ? "fragrance" : "fragrances"}
            {results.length > 0 && (
              <>
                {" · from "}
                <span className="text-gold-200">{formatPrice(lowPrice)}</span>
              </>
            )}
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <form
            onSubmit={(event) => {
              event.preventDefault();
              push({ q: searchDraft.trim() });
            }}
            className="relative"
          >
            <input
              type="search"
              value={searchDraft}
              onChange={(event) => setSearchDraft(event.target.value)}
              placeholder="Search notes, names…"
              aria-label="Search fragrances"
              className="field w-full pl-10 sm:w-64"
            />
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-500"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" strokeLinecap="round" />
            </svg>
          </form>

          <label className="relative">
            <span className="sr-only">Sort by</span>
            <select
              value={filters.sort}
              onChange={(event) =>
                push({ sort: event.target.value as SortKey })
              }
              className="field appearance-none pr-10"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-ink-400"
            >
              <path d="m6 9 6 6 6-6" strokeLinecap="round" />
            </svg>
          </label>
        </div>
      </div>

      {/* --------------------------- Active filters -------------------------- */}
      {(activeCount > 0 || filters.sort !== defaultFilters.sort) && (
        <div className="flex flex-wrap items-center gap-2 pt-6">
          {filters.q && (
            <Chip label={`“${filters.q}”`} onRemove={() => push({ q: "" })} />
          )}
          {filters.brands.map((slug) => (
            <Chip
              key={slug}
              label={getBrandBySlug(slug)?.name ?? slug}
              onRemove={() => toggle("brands", slug as never)}
            />
          ))}
          {filters.families.map((family) => (
            <Chip
              key={family}
              label={family}
              onRemove={() => toggle("families", family as never)}
            />
          ))}
          {filters.audiences.map((audience) => (
            <Chip
              key={audience}
              label={audience}
              onRemove={() => toggle("audiences", audience as never)}
            />
          ))}
          {filters.concentrations.map((concentration) => (
            <Chip
              key={concentration}
              label={concentration}
              onRemove={() =>
                toggle("concentrations", concentration as never)
              }
            />
          ))}
          {filters.sizes.map((size) => (
            <Chip
              key={size}
              label={`${size}ml`}
              onRemove={() => toggle("sizes", size as never)}
            />
          ))}
          {(filters.min > defaultFilters.min ||
            filters.max < defaultFilters.max) && (
            <Chip
              label={`${formatPrice(filters.min)} – ${formatPrice(filters.max)}`}
              onRemove={() =>
                push({ min: defaultFilters.min, max: defaultFilters.max })
              }
            />
          )}
          {filters.onSale && (
            <Chip label="On sale" onRemove={() => toggleFlag("onSale")} />
          )}
          {filters.inStock && (
            <Chip label="In stock" onRemove={() => toggleFlag("inStock")} />
          )}

          <button
            type="button"
            onClick={clearAll}
            className="ml-1 text-xs font-medium text-gold-300 underline-offset-4 transition hover:text-gold-100 hover:underline"
          >
            Clear all
          </button>
        </div>
      )}

      {/* -------------------------------- Body ------------------------------- */}
      <div className="mt-8 flex gap-10">
        <aside className="hidden w-64 shrink-0 lg:block">
          <div className="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto pr-3">
            {panel}
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          {results.length === 0 ? (
            <div className="surface flex flex-col items-center justify-center px-8 py-24 text-center">
              <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-white/10 bg-white/[0.03]">
                <svg
                  width="26"
                  height="26"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.3"
                  className="text-ink-400"
                >
                  <circle cx="11" cy="11" r="7" />
                  <path d="m20 20-3.5-3.5" strokeLinecap="round" />
                </svg>
              </div>
              <h2 className="font-display text-2xl text-white">
                Nothing matches those filters
              </h2>
              <p className="mt-3 max-w-sm text-sm text-ink-300">
                Try widening your price range or clearing a filter or two — our
                collection runs from {formatPrice(defaultFilters.min)} to{" "}
                {formatPrice(defaultFilters.max)}.
              </p>
              <button type="button" onClick={clearAll} className="btn-primary mt-7">
                Reset filters
              </button>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {results.map((product, index) => (
                <ProductCard
                  key={product.slug}
                  product={product}
                  priority={index < 3}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* --------------------------- Mobile filters -------------------------- */}
      <button
        type="button"
        onClick={() => setSheetOpen(true)}
        className="btn-primary fixed bottom-5 left-1/2 z-40 -translate-x-1/2 px-6 shadow-2xl lg:hidden"
      >
        <svg
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.9"
        >
          <path d="M4 6h16M7 12h10M10 18h4" strokeLinecap="round" />
        </svg>
        Filters{activeCount > 0 ? ` (${activeCount})` : ""}
      </button>

      {sheetOpen && (
        <div className="fixed inset-0 z-[80] lg:hidden">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setSheetOpen(false)}
          />
          <div className="absolute inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto rounded-t-3xl border-t border-white/10 bg-ink-900 px-6 pb-10 pt-4">
            <div className="mx-auto mb-5 h-1 w-10 rounded-full bg-white/20" />
            <div className="flex items-center justify-between pb-4">
              <h2 className="font-display text-2xl text-white">Filters</h2>
              <button
                type="button"
                onClick={() => setSheetOpen(false)}
                className="rounded-full p-2 text-ink-300 hover:bg-white/5 hover:text-white"
                aria-label="Close filters"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                >
                  <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" />
                </svg>
              </button>
            </div>
            {panel}
            <div className="mt-8 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  clearAll();
                  setSheetOpen(false);
                }}
                className="btn-secondary"
              >
                Clear all
              </button>
              <button
                type="button"
                onClick={() => setSheetOpen(false)}
                className="btn-primary"
              >
                Show {results.length} results
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Chip({
  label,
  onRemove,
}: {
  label: string;
  onRemove: () => void;
}) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-gold-400/30 bg-gold-400/10 py-1.5 pl-3.5 pr-2 text-xs text-gold-100">
      {label}
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Remove filter ${label}`}
        className="flex h-4 w-4 items-center justify-center rounded-full text-gold-200 transition hover:bg-gold-400/20 hover:text-white"
      >
        <svg
          width="10"
          height="10"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
        >
          <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" />
        </svg>
      </button>
    </span>
  );
}
