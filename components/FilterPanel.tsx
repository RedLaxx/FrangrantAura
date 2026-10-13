"use client";

import { brands, countProductsByBrand } from "@/lib/products";
import { priceBounds, priceStep, sizeOptions } from "@/lib/filters";
import type { Audience, Concentration, ScentFamily } from "@/lib/types";
import type { FilterState } from "@/lib/filters";
import PriceRangeFilter from "./PriceRangeFilter";

const familyOptions: ScentFamily[] = [
  "Floral",
  "Woody",
  "Oriental",
  "Fresh",
  "Gourmand",
  "Fruity",
];

const audienceOptions: Audience[] = ["Women", "Men", "Unisex"];

const concentrationOptions: Concentration[] = [
  "Eau de Toilette",
  "Eau de Parfum",
  "Extrait de Parfum",
];

interface FilterPanelProps {
  filters: FilterState;
  onToggle: <K extends keyof FilterState>(
    key: K,
    value: FilterState[K] extends Array<infer U> ? U : never,
  ) => void;
  onPriceChange: (value: { min: number; max: number }) => void;
  onToggleFlag: (key: "onSale" | "inStock") => void;
}

export default function FilterPanel({
  filters,
  onToggle,
  onPriceChange,
  onToggleFlag,
}: FilterPanelProps) {
  return (
    <div className="space-y-8">
      <section>
        <h3 className="text-xs font-semibold uppercase tracking-[0.22em] text-gold-300">
          Price range
        </h3>
        <div className="mt-5">
          <PriceRangeFilter
            min={priceBounds.min}
            max={priceBounds.max}
            step={priceStep}
            value={{ min: filters.min, max: filters.max }}
            onChange={onPriceChange}
          />
        </div>
      </section>

      <Divider />

      <FilterGroup title="Brand">
        {brands.map((brand) => (
          <CheckboxRow
            key={brand.slug}
            label={brand.name}
            hint={String(countProductsByBrand(brand.slug))}
            checked={filters.brands.includes(brand.slug)}
            onChange={() => onToggle("brands", brand.slug)}
          />
        ))}
      </FilterGroup>

      <Divider />

      <FilterGroup title="Scent family">
        {familyOptions.map((family) => (
          <CheckboxRow
            key={family}
            label={family}
            checked={filters.families.includes(family)}
            onChange={() => onToggle("families", family)}
          />
        ))}
      </FilterGroup>

      <Divider />

      <FilterGroup title="For">
        {audienceOptions.map((audience) => (
          <CheckboxRow
            key={audience}
            label={audience}
            checked={filters.audiences.includes(audience)}
            onChange={() => onToggle("audiences", audience)}
          />
        ))}
      </FilterGroup>

      <Divider />

      <FilterGroup title="Concentration">
        {concentrationOptions.map((concentration) => (
          <CheckboxRow
            key={concentration}
            label={concentration}
            checked={filters.concentrations.includes(concentration)}
            onChange={() => onToggle("concentrations", concentration)}
          />
        ))}
      </FilterGroup>

      <Divider />

      <FilterGroup title="Size">
        <div className="flex flex-wrap gap-2">
          {sizeOptions.map((size) => {
            const active = filters.sizes.includes(size);
            return (
              <button
                key={size}
                type="button"
                onClick={() => onToggle("sizes", size)}
                className={`chip ${active ? "chip-active" : ""}`}
              >
                {size}ml
              </button>
            );
          })}
        </div>
      </FilterGroup>

      <Divider />

      <FilterGroup title="Availability">
        <CheckboxRow
          label="On sale"
          checked={filters.onSale}
          onChange={() => onToggleFlag("onSale")}
        />
        <CheckboxRow
          label="In stock only"
          checked={filters.inStock}
          onChange={() => onToggleFlag("inStock")}
        />
      </FilterGroup>
    </div>
  );
}

function Divider() {
  return <div className="h-px bg-white/[0.07]" />;
}

function FilterGroup({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h3 className="text-xs font-semibold uppercase tracking-[0.22em] text-gold-300">
        {title}
      </h3>
      <div className="mt-4 space-y-1">{children}</div>
    </section>
  );
}

function CheckboxRow({
  label,
  hint,
  checked,
  onChange,
}: {
  label: string;
  hint?: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="group flex cursor-pointer items-center gap-3 rounded-lg px-1 py-2 transition hover:bg-white/[0.03]">
      <span
        className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-[5px] border transition ${
          checked
            ? "border-gold-400 bg-gold-400"
            : "border-white/25 bg-transparent group-hover:border-white/40"
        }`}
      >
        {checked && (
          <svg
            width="11"
            height="11"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#0d0d10"
            strokeWidth="3.4"
          >
            <path d="m4 12.5 5 5L20 6.5" strokeLinecap="round" />
          </svg>
        )}
      </span>
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="sr-only"
      />
      <span
        className={`flex-1 text-sm transition ${
          checked ? "text-white" : "text-ink-300 group-hover:text-ink-100"
        }`}
      >
        {label}
      </span>
      {hint && <span className="text-xs text-ink-500">{hint}</span>}
    </label>
  );
}
