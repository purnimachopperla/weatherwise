/**
 * SavedLocations.jsx — Responsive saved location list with touch-friendly controls.
 *
 * Shows saved cities as clickable cards.
 * Selecting a card changes the current location in the app.
 * Large touch targets for both selecting and removing locations.
 */

import { MapPin, Star, X, Plus } from 'lucide-react';

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
    <div className="glass-card-static fade-in p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-indigo-500/20">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <h3 className="text-xs sm:text-sm text-slate-400 font-bold uppercase tracking-wider">
          📌 Saved Locations
        </h3>
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
        <div className="text-center py-6 px-4 bg-slate-900/40 rounded-2xl border border-indigo-500/10">
          <Star size={24} className="text-slate-500 mx-auto mb-2 opacity-60" />
          <p className="text-xs sm:text-sm text-slate-300 font-medium">
            No saved locations yet
          </p>
          <p className="text-[11px] text-slate-500 mt-1">
            Search for a city and click "Save Current"
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {savedLocations.map((loc) => {
            const isActive =
              Math.abs(loc.latitude - (currentLocation?.latitude || 0)) < 0.01 &&
              Math.abs(loc.longitude - (currentLocation?.longitude || 0)) < 0.01;

            return (
              <div
                key={loc.id}
                className={`flex items-center justify-between gap-2 p-2 sm:p-2.5 rounded-xl border transition-all ${
                  isActive
                    ? 'bg-indigo-500/15 border-indigo-500/40 shadow-sm shadow-indigo-500/20'
                    : 'bg-slate-900/60 border-indigo-500/10 hover:border-indigo-500/30'
                }`}
              >
                {/* Select button */}
                <button
                  onClick={() => onSelectLocation(loc)}
                  className="flex-1 flex items-center gap-2.5 min-h-[42px] px-2 text-left cursor-pointer min-w-0"
                  aria-label={`Switch to ${loc.name}`}
                >
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${isActive ? 'bg-indigo-500/20 text-cyan-300' : 'bg-slate-800 text-slate-400'}`}>
                    <MapPin size={14} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className={`text-xs sm:text-sm truncate ${isActive ? 'text-slate-100 font-bold' : 'text-slate-300 font-semibold'}`}>
                      {loc.name}
                    </p>
                    {loc.country && (
                      <p className="text-[10px] sm:text-[11px] text-slate-500 truncate">{loc.country}</p>
                    )}
                  </div>
                  {isActive && (
                    <span className="text-[10px] text-cyan-300 font-bold px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex-shrink-0">
                      Active
                    </span>
                  )}
                </button>

                {/* Remove button (touch target >= 40px) */}
                <button
                  onClick={() => onRemoveLocation(loc.id)}
                  aria-label={`Remove ${loc.name}`}
                  className="w-9 h-9 flex items-center justify-center rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 active:bg-red-500/20 transition-colors flex-shrink-0 cursor-pointer"
                  title="Remove location"
                >
                  <X size={15} />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

