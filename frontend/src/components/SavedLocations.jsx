/**
 * SavedLocations.jsx — Sleek quick-switch saved locations strip.
 *
 * Visual Features:
 * - One-tap location switcher
 * - Modern capsule pills / tiles
 * - Clear active city indicator
 */

import { MapPin, Plus, X, Bookmark } from 'lucide-react';

export default function SavedLocations({
  savedLocations,
  currentLocation,
  onSelectLocation,
  onRemoveLocation,
  onSaveCurrentLocation,
}) {
  const isCurrentSaved = savedLocations.some(
    (loc) =>
      Math.abs(loc.latitude - (currentLocation?.latitude || 0)) < 0.01 &&
      Math.abs(loc.longitude - (currentLocation?.longitude || 0)) < 0.01
  );

  return (
    <section aria-label="Saved Locations" className="fade-in w-full">
      <div className="glass-panel p-5 sm:p-6 rounded-3xl border border-white/5">
        {/* Header */}
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <Bookmark size={16} className="text-cyan-400" />
            <h3 className="text-xs sm:text-sm font-bold text-slate-300 uppercase tracking-wider">
              Saved Locations
            </h3>
          </div>

          {currentLocation && !isCurrentSaved && (
            <button
              className="btn-ghost !py-1.5 !px-3 text-xs font-semibold rounded-xl"
              onClick={onSaveCurrentLocation}
              title={`Save ${currentLocation.name}`}
            >
              <Plus size={13} />
              <span>Save Current</span>
            </button>
          )}
        </div>

        {/* Location List */}
        {savedLocations.length === 0 ? (
          <div className="text-center py-6 px-4 bg-slate-950/40 rounded-2xl border border-white/5">
            <Bookmark size={22} className="text-slate-600 mx-auto mb-2" />
            <p className="text-xs sm:text-sm text-slate-300 font-medium">
              No saved locations yet
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Search any city and click "Save Current"
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
            {savedLocations.map((loc) => {
              const isActive =
                Math.abs(loc.latitude - (currentLocation?.latitude || 0)) < 0.01 &&
                Math.abs(loc.longitude - (currentLocation?.longitude || 0)) < 0.01;

              return (
                <div
                  key={loc.id}
                  className={`flex items-center justify-between gap-2 p-2.5 rounded-2xl border transition-all ${
                    isActive
                      ? 'bg-indigo-500/20 border-indigo-500/40 shadow-sm shadow-indigo-500/20'
                      : 'bg-slate-950/60 border-white/5 hover:border-white/15'
                  }`}
                >
                  {/* Select button */}
                  <button
                    onClick={() => onSelectLocation(loc)}
                    className="flex-1 flex items-center gap-2.5 min-h-[38px] px-1 text-left cursor-pointer min-w-0"
                    aria-label={`Switch to ${loc.name}`}
                  >
                    <div className={`w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 ${isActive ? 'bg-indigo-500/30 text-cyan-300' : 'bg-slate-900 text-slate-400'}`}>
                      <MapPin size={13} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className={`text-xs sm:text-sm truncate ${isActive ? 'text-slate-100 font-bold' : 'text-slate-300 font-semibold'}`}>
                        {loc.name}
                      </p>
                      {loc.country && (
                        <p className="text-[10px] text-slate-500 truncate">{loc.country}</p>
                      )}
                    </div>
                    {isActive && (
                      <span className="text-[9px] text-cyan-300 font-bold px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex-shrink-0">
                        Active
                      </span>
                    )}
                  </button>

                  {/* Remove button */}
                  <button
                    onClick={() => onRemoveLocation(loc.id)}
                    aria-label={`Remove ${loc.name}`}
                    className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 active:bg-red-500/20 transition-colors flex-shrink-0 cursor-pointer"
                    title="Remove location"
                  >
                    <X size={14} />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
