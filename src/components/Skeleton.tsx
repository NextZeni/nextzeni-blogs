/**
 * Shimmer skeleton primitives.
 *
 * The `.shimmer` class (globals.css) paints the tint + light sweep; size,
 * radius and spacing always come from utilities passed in `className`.
 * These are plain components with no hooks, so they work both inside client
 * pages and inside server-rendered `loading.tsx` fallbacks.
 */

export function Skeleton({ className = "" }: { className?: string }) {
  return <div aria-hidden className={`shimmer rounded-lg ${className}`} />;
}

export function SkeletonCircle({ className = "w-10 h-10" }: { className?: string }) {
  return <div aria-hidden className={`shimmer rounded-full ${className}`} />;
}

/** A paragraph of shimmer lines; the last one is shortened like real text. */
export function SkeletonText({
  lines = 3,
  className = "",
  lineClassName = "h-3.5",
  lastLineWidth = "w-2/3",
}: {
  lines?: number;
  className?: string;
  lineClassName?: string;
  lastLineWidth?: string;
}) {
  return (
    <div aria-hidden className={`space-y-2.5 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={`shimmer rounded-md ${lineClassName} ${
            i === lines - 1 ? lastLineWidth : "w-full"
          }`}
        />
      ))}
    </div>
  );
}

/** Pill row — category tabs, topic chips, filter tabs. */
export function SkeletonChips({
  count = 6,
  className = "",
  widths = ["w-16", "w-24", "w-20", "w-28", "w-16", "w-24", "w-20"],
}: {
  count?: number;
  className?: string;
  widths?: string[];
}) {
  return (
    <div aria-hidden className={`flex gap-2 flex-wrap ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={`shimmer h-8 rounded-full ${widths[i % widths.length]}`} />
      ))}
    </div>
  );
}

/**
 * Wrapper that announces a loading region to screen readers while the
 * shimmer stands in for content.
 */
export function SkeletonRegion({
  label = "Loading",
  className = "",
  children,
}: {
  label?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div role="status" aria-busy="true" aria-live="polite" className={className}>
      <span className="sr-only">{label}</span>
      {children}
    </div>
  );
}
