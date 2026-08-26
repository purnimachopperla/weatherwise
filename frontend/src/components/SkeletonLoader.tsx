import React from 'react';

export const SkeletonLoader: React.FC = () => {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Top Banner Skeleton */}
      <div className="h-14 rounded-2xl bg-white/5 border border-white/5" />

      {/* Main Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6">
          <div className="h-64 rounded-2xl bg-white/5 border border-white/5" />
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-24 rounded-2xl bg-white/5 border border-white/5" />
            ))}
          </div>
          <div className="h-44 rounded-2xl bg-white/5 border border-white/5" />
          <div className="h-72 rounded-2xl bg-white/5 border border-white/5" />
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="h-72 rounded-2xl bg-white/5 border border-white/5" />
          <div className="h-72 rounded-2xl bg-white/5 border border-white/5" />
          <div className="h-96 rounded-2xl bg-white/5 border border-white/5" />
        </div>
      </div>
    </div>
  );
};
