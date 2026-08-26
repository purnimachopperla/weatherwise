/**
 * LoadingState.jsx — Skeleton loading animation shown while data fetches.
 *
 * Uses shimmer animation to indicate that content is loading,
 * which is much better than a blank screen or a spinner.
 */

export default function LoadingState() {
  return (
    <div className="fade-in space-y-5">
      {/* Hero skeleton */}
      <div className="glass-card-static p-8">
        <div className="flex items-start justify-between">
          <div className="space-y-3 flex-1">
            <div className="skeleton h-5 w-32 rounded" />
            <div className="skeleton h-16 w-48 rounded" />
            <div className="skeleton h-5 w-40 rounded" />
            <div className="skeleton h-4 w-28 rounded" />
          </div>
          <div className="skeleton h-28 w-28 rounded-full" />
        </div>
      </div>

      {/* Stats grid skeleton */}
      <div className="stats-grid">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="glass-card-static p-5">
            <div className="skeleton h-4 w-20 rounded mb-3" />
            <div className="skeleton h-8 w-16 rounded mb-2" />
            <div className="skeleton h-3 w-14 rounded" />
          </div>
        ))}
      </div>

      {/* Hourly forecast skeleton */}
      <div className="glass-card-static p-5">
        <div className="skeleton h-5 w-40 rounded mb-4" />
        <div className="flex gap-3 overflow-hidden">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex-shrink-0 w-16 space-y-2">
              <div className="skeleton h-3 w-12 rounded" />
              <div className="skeleton h-8 w-8 rounded-full mx-auto" />
              <div className="skeleton h-4 w-10 rounded mx-auto" />
            </div>
          ))}
        </div>
      </div>

      {/* Recommendation skeleton */}
      <div className="glass-card-static p-6">
        <div className="skeleton h-5 w-52 rounded mb-4" />
        <div className="skeleton h-4 w-full rounded mb-2" />
        <div className="skeleton h-4 w-3/4 rounded mb-4" />
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex gap-3 items-start p-3 rounded-lg border border-white/5">
              <div className="skeleton h-8 w-8 rounded-full flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="skeleton h-4 w-32 rounded" />
                <div className="skeleton h-3 w-full rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
