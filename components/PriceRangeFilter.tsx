"use client";

import { useEffect, useRef, useState } from "react";
import { formatPriceCompact } from "@/lib/format";

interface PriceRangeFilterProps {
  min: number;
  max: number;
  step: number;
  value: { min: number; max: number };
  onChange: (value: { min: number; max: number }) => void;
}

/**
 * Dual-thumb price slider.
 *
 * Local state keeps dragging smooth; the parent URL state is updated on a
 * short debounce so we don't push a history entry for every pixel moved.
 */
export default function PriceRangeFilter({
  min,
  max,
  step,
  value,
  onChange,
}: PriceRangeFilterProps) {
  const [local, setLocal] = useState(value);
  const isFirstRender = useRef(true);

  // Adopt external changes (e.g. "Clear all", preset links from the homepage).
  useEffect(() => {
    setLocal(value);
  }, [value.min, value.max]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (local.min === value.min && local.max === value.max) return;
    const timer = window.setTimeout(() => onChange(local), 280);
    return () => window.clearTimeout(timer);
  }, [local, onChange, value.min, value.max]);

  const setMin = (next: number) =>
    setLocal((current) => ({
      min: Math.min(next, current.max - step),
      max: current.max,
    }));

  const setMax = (next: number) =>
    setLocal((current) => ({
      min: current.min,
      max: Math.max(next, current.min + step),
    }));

  const leftPercent = ((local.min - min) / (max - min)) * 100;
  const rightPercent = ((local.max - min) / (max - min)) * 100;

  return (
    <div>
      <div className="mb-5 flex items-center justify-between gap-3">
        <div className="flex-1 rounded-xl border border-white/10 bg-ink-900/70 px-3 py-2">
          <span className="block text-[10px] uppercase tracking-wider text-ink-500">
            Min
          </span>
          <span className="text-sm font-medium text-white">
            {formatPriceCompact(local.min)}
          </span>
        </div>
        <span className="h-px w-3 shrink-0 bg-white/20" />
        <div className="flex-1 rounded-xl border border-white/10 bg-ink-900/70 px-3 py-2">
          <span className="block text-[10px] uppercase tracking-wider text-ink-500">
            Max
          </span>
          <span className="text-sm font-medium text-white">
            {local.max >= max ? `${formatPriceCompact(local.max)}+` : formatPriceCompact(local.max)}
          </span>
        </div>
      </div>

      <div className="relative h-1.5">
        <div className="absolute inset-0 rounded-full bg-white/10" />
        <div
          className="absolute inset-y-0 rounded-full"
          style={{
            left: `${leftPercent}%`,
            right: `${100 - rightPercent}%`,
            backgroundImage:
              "linear-gradient(90deg, #d0ac4c 0%, #f0dcaa 100%)",
          }}
        />

        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={local.min}
          onChange={(event) => setMin(Number(event.target.value))}
          className="range-input"
          aria-label="Minimum price"
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={local.max}
          onChange={(event) => setMax(Number(event.target.value))}
          className="range-input"
          aria-label="Maximum price"
        />
      </div>

      <div className="mt-3 flex items-center justify-between text-[11px] text-ink-500">
        <span>{formatPriceCompact(min)}</span>
        <span>{formatPriceCompact(max)}+</span>
      </div>
    </div>
  );
}
