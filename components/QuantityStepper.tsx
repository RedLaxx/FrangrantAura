"use client";

interface QuantityStepperProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  size?: "sm" | "md";
}

export default function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 10,
  size = "md",
}: QuantityStepperProps) {
  const button =
    size === "sm"
      ? "h-7 w-7 text-sm"
      : "h-9 w-9 text-base";

  return (
    <div className="inline-flex items-center rounded-full border border-white/10 bg-ink-900/70">
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        aria-label="Decrease quantity"
        className={`${button} flex items-center justify-center rounded-full text-ink-300 transition hover:text-white disabled:opacity-30`}
      >
        −
      </button>
      <span
        className={`${size === "sm" ? "w-6 text-xs" : "w-8 text-sm"} text-center font-medium text-white`}
        aria-live="polite"
      >
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        aria-label="Increase quantity"
        className={`${button} flex items-center justify-center rounded-full text-ink-300 transition hover:text-white disabled:opacity-30`}
      >
        +
      </button>
    </div>
  );
}
