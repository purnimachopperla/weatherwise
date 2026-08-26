/**
 * SavedLocations.jsx — Monitored Telemetry Stations & Saved Regions.
 *
 * Professional station list with quick-switch capability.
 */

import { MapPin, Plus, X, Bookmark, Radio } from 'lucide-react';

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
    <section aria-label="Monitored Stations" className="fade-in w-full">
      <div className="panel-card p-5 sm:p-6 bg-white border border-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between gap-3 mb-4 pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Radio size={16} className="text-teal-700" />
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Monitored Telemetry Stations ({savedLocations.length})
            </h3>
          </div>

          {currentLocation && !isCurrentSaved && (
            <button
              className="btn-secondary !py-1.5 !px-3 text-xs font-semibold rounded-lg flex items-center gap-1"
              onClick={onSaveCurrentLocation}
              title={`Save ${currentLocation.name}`}
            >
              <Plus size={13} />
              <span>Add Current Station</span>
            </button>
          )}
        </div>

        {/* Stations Grid */}
        {savedLocations.length === 0 ? (
          <div className="text-center py-6 px-4 bg-slate-50 rounded-xl border border-slate-200">
            <Radio size={22} className="text-slate-400 mx-auto mb-2 opacity-70" />
            <p className="text-xs sm:text-sm text-slate-700 font-medium">
              No custom monitoring stations configured
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Search any regional location and click "Add Current Station" to monitor telemetry.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {savedLocations.map((loc) => {
              const isActive =
                Math.abs(loc.latitude - (currentLocation?.latitude || 0)) < 0.01 &&
                Math.abs(loc.longitude - (currentLocation?.longitude || 0)) < 0.01;

              return (
                <div
                  key={loc.id}
                  className={`flex items-center justify-between gap-2 p-3 rounded-xl border transition-all ${
                    isActive
                      ? 'bg-teal-50 border-teal-300 shadow-2xs'
                      : 'bg-slate-50/70 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {/* Select button */}
                  <button
                    onClick={() => onSelectLocation(loc)}
                    className="flex-1 flex items-center gap-2.5 text-left cursor-pointer min-w-0"
                    aria-label={`Switch to ${loc.name}`}
                  >
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${isActive ? 'bg-teal-700 text-white' : 'bg-slate-200 text-slate-600'}`}>
                      <MapPin size={13} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className={`text-xs font-semibold truncate ${isActive ? 'text-teal-950 font-bold' : 'text-slate-800'}`}>
                        {loc.name}
                      </p>
                      {loc.country && (
                        <p className="text-[10px] text-slate-500 truncate">{loc.country}</p>
                      )}
                    </div>
                    {isActive && (
                      <span className="text-[9px] text-teal-800 font-bold px-1.5 py-0.5 rounded bg-teal-100/80 border border-teal-300 flex-shrink-0">
                        ACTIVE
                      </span>
                    )}
                  </button>

                  {/* Remove button */}
                  <button
                    onClick={() => onRemoveLocation(loc.id)}
                    aria-label={`Remove ${loc.name}`}
                    className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors flex-shrink-0 cursor-pointer"
                    title="Remove station"
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
