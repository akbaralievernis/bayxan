import { cn } from "@/lib/utils";

/**
 * Premium dark-gold skeleton primitive. Used inside `loading.jsx` boundaries
 * while server components stream from Supabase. Pure CSS — no Framer Motion —
 * so it costs nothing on first paint and avoids hydration cost.
 *
 * Variants:
 *   - default → soft pulsing warm-walnut block
 *   - shimmer → animated gold sheen sweeping across (use sparingly)
 *   - text    → narrower rounded bar tuned for inline text rows
 *   - circle  → square aspect-ratio for avatars / icons
 */
export default function Skeleton({
  className,
  variant = "default",
  width,
  height,
  style,
}) {
  const base = "relative overflow-hidden bg-[#231A12] border border-amber-900/30";

  const variants = {
    default: "rounded-xl animate-pulse",
    text: "rounded-md h-3.5 animate-pulse",
    circle: "rounded-full aspect-square animate-pulse",
    shimmer: "rounded-xl",
  };

  return (
    <div
      aria-hidden
      className={cn(base, variants[variant], className)}
      style={{ width, height, ...style }}
    >
      {variant === "shimmer" && (
        <span
          className="absolute inset-0 -translate-x-full animate-[shimmer_1.6s_infinite] bg-gradient-to-r from-transparent via-amber-500/10 to-transparent"
          style={{ animationName: "shimmer" }}
        />
      )}
    </div>
  );
}

/* Convenience composites — use directly inside loading.jsx files. */

export function SkeletonText({ lines = 3, className }) {
  return (
    <div className={cn("space-y-2", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          variant="text"
          className={i === lines - 1 ? "w-2/3" : "w-full"}
        />
      ))}
    </div>
  );
}

export function SkeletonCard({ className }) {
  return (
    <div
      className={cn(
        "rounded-2xl p-4 bg-[#1A1410]/60 border border-amber-900/20",
        className
      )}
    >
      <Skeleton className="aspect-[4/3] mb-3" />
      <Skeleton variant="text" className="w-3/4 mb-2 h-4" />
      <SkeletonText lines={2} />
    </div>
  );
}
