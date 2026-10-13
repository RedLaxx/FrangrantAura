import Link from "next/link";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: { href: string; label: string };
  align?: "left" | "center";
}

export default function SectionHeading({
  eyebrow,
  title,
  description,
  action,
  align = "left",
}: SectionHeadingProps) {
  return (
    <div
      className={`flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between ${
        align === "center" ? "sm:flex-col sm:items-center sm:text-center" : ""
      }`}
    >
      <div className={align === "center" ? "mx-auto max-w-2xl" : "max-w-2xl"}>
        {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
        <h2 className="section-title text-balance text-white">{title}</h2>
        {description && (
          <p className="mt-4 text-sm leading-relaxed text-ink-300 sm:text-base">
            {description}
          </p>
        )}
      </div>

      {action && (
        <Link
          href={action.href}
          className="group inline-flex shrink-0 items-center gap-2 text-sm font-medium text-gold-200 transition hover:text-gold-100"
        >
          {action.label}
          <span className="transition-transform duration-200 group-hover:translate-x-1">
            →
          </span>
        </Link>
      )}
    </div>
  );
}
