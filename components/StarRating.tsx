interface StarRatingProps {
  rating: number;
  reviewCount?: number;
  size?: "sm" | "md";
  showValue?: boolean;
}

export default function StarRating({
  rating,
  reviewCount,
  size = "sm",
  showValue = true,
}: StarRatingProps) {
  const dimension = size === "sm" ? "h-3 w-3" : "h-4 w-4";

  return (
    <div className="flex items-center gap-2">
      <div
        className="flex items-center gap-0.5"
        aria-label={`Rated ${rating} out of 5`}
      >
        {[1, 2, 3, 4, 5].map((star) => {
          const fill = Math.max(0, Math.min(1, rating - star + 1));
          return (
            <span key={star} className={`relative ${dimension}`}>
              <svg
                viewBox="0 0 20 20"
                className={`${dimension} text-white/15`}
                fill="currentColor"
              >
                <path d="M10 1.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.8-5.2 2.8 1-5.8L1.5 7.7l5.9-.9L10 1.5z" />
              </svg>
              <span
                className="absolute inset-0 overflow-hidden"
                style={{ width: `${fill * 100}%` }}
              >
                <svg
                  viewBox="0 0 20 20"
                  className={`${dimension} text-gold-300`}
                  fill="currentColor"
                >
                  <path d="M10 1.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.8-5.2 2.8 1-5.8L1.5 7.7l5.9-.9L10 1.5z" />
                </svg>
              </span>
            </span>
          );
        })}
      </div>
      {showValue && (
        <span className="text-xs text-ink-400">
          {rating.toFixed(1)}
          {typeof reviewCount === "number" && (
            <span className="text-ink-500"> ({reviewCount})</span>
          )}
        </span>
      )}
    </div>
  );
}
