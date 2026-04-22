import { Star } from "lucide-react";

interface StarRatingProps {
  value: number;
  max?: number;
  size?: "sm" | "md" | "lg";
  onChange?: (value: number) => void;
  readOnly?: boolean;
}

const sizeMap = {
  sm: "w-3.5 h-3.5",
  md: "w-4 h-4",
  lg: "w-6 h-6",
};

const StarRating = ({ value, max = 5, size = "md", onChange, readOnly }: StarRatingProps) => {
  const cls = sizeMap[size];
  const interactive = !readOnly && typeof onChange === "function";

  return (
    <div className="inline-flex items-center gap-0.5">
      {Array.from({ length: max }).map((_, i) => {
        const idx = i + 1;
        const filled = idx <= Math.round(value);
        const StarEl = (
          <Star
            className={`${cls} ${filled ? "fill-primary text-primary" : "text-muted-foreground"} transition-colors`}
          />
        );
        if (!interactive) return <span key={i}>{StarEl}</span>;
        return (
          <button
            key={i}
            type="button"
            onClick={() => onChange?.(idx)}
            aria-label={`${idx} yıldız`}
            className="hover:scale-110 transition-transform"
          >
            {StarEl}
          </button>
        );
      })}
    </div>
  );
};

export default StarRating;
