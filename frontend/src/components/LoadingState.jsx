/**
 * LoadingState.jsx — Clean light-theme skeleton telemetry animation.
 */

export default function LoadingState() {
  return (
    <div className="fade-in space-y-5">
      {/* Hero skeleton */}
      <div className="panel-card p-8 bg-white border border-slate-200">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3 flex-1">
            <div className="skeleton h-5 w-36 rounded" />
            <div className="skeleton h-14 w-44 rounded-xl" />
            <div className="skeleton h-5 w-40 rounded" />
            <div className="skeleton h-4 w-52 rounded" />
          </div>
          <div className="skeleton h-32 w-full md:w-80 rounded-xl" />
        </div>
      </div>

      {/* Metrics skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="panel-card p-4 bg-white border border-slate-200">
            <div className="skeleton h-4 w-20 rounded mb-2.5" />
            <div className="skeleton h-7 w-16 rounded mb-2" />
            <div className="skeleton h-3 w-14 rounded" />
          </div>
        ))}
      </div>

      {/* Intelligence Section skeleton */}
      <div className="panel-card p-6 bg-white border border-slate-200">
        <div className="skeleton h-5 w-56 rounded mb-4" />
        <div className="skeleton h-12 w-full rounded-xl mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="skeleton h-24 rounded-xl" />
          <div className="skeleton h-24 rounded-xl" />
          <div className="skeleton h-24 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
