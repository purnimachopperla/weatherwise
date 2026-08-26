/**
 * Header.jsx — Responsive App navigation header.
 *
 * Fully responsive:
 * - Desktop: Sleek single-row layout
 * - Tablet/Mobile: Adaptive 2-row layout with full-width search and comfortable touch targets
 */

import { Navigation, Loader, MapPin, Settings } from 'lucide-react';
import LocationSearch from './LocationSearch';

export default function Header({ location, onSelectLocation, onDetectLocation, detecting, onOpenSettings }) {
  return (
    <header
      className="sticky top-0 z-50 px-3 sm:px-6 py-2.5 sm:py-3 border-b border-indigo-500/20 bg-slate-950/90 backdrop-blur-xl"
    >
      <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row md:items-center gap-2.5 sm:gap-4">
        {/* Top bar on mobile / Left group on desktop */}
        <div className="flex items-center justify-between gap-2 sm:gap-4 w-full md:w-auto">
          {/* Logo */}
          <div className="flex items-center gap-2 sm:gap-2.5 flex-shrink-0">
            <div
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center text-base sm:text-lg shadow-md shadow-indigo-500/20"
              style={{ background: 'linear-gradient(135deg, #6366f1, #06b6d4)' }}
            >
              🌤️
            </div>
            <div>
              <h1 className="gradient-text text-base sm:text-lg font-black tracking-tight leading-none">
                WeatherWise
              </h1>
              <p className="text-[10px] text-slate-400 font-medium tracking-wide mt-0.5 hidden xs:block">
                Smart Weather Assistant
              </p>
            </div>
          </div>

          {/* Current Location Badge (tablet / mobile top right or next to logo) */}
          {location && (
            <div className="hidden sm:flex md:hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex-shrink-0 max-w-[200px] truncate">
              <MapPin size={12} className="text-indigo-400 flex-shrink-0" />
              <span className="text-xs text-slate-300 font-medium truncate">
                {location.name}{location.country ? `, ${location.country}` : ''}
              </span>
            </div>
          )}

          {/* Mobile Action Buttons (My Location & Settings) */}
          <div className="flex items-center gap-1.5 sm:gap-2 md:hidden">
            <button
              className="btn-ghost !p-2 !min-h-[38px] !min-w-[38px] flex items-center justify-center rounded-xl"
              onClick={onDetectLocation}
              disabled={detecting}
              aria-label="Use my current location"
              title="Use current location"
            >
              {detecting ? (
                <Loader size={16} className="animate-spin text-cyan-400" />
              ) : (
                <Navigation size={16} className="text-cyan-400" />
              )}
            </button>

            <button
              className="btn-ghost !p-2 !min-h-[38px] !min-w-[38px] flex items-center justify-center rounded-xl"
              onClick={onOpenSettings}
              aria-label="Open settings"
              title="Settings"
            >
              <Settings size={16} className="text-slate-300" />
            </button>
          </div>
        </div>

        {/* Search input (full width on mobile, flexible on desktop) */}
        <div className="flex-1 w-full min-w-0">
          <LocationSearch onSelectLocation={onSelectLocation} />
        </div>

        {/* Desktop Action Buttons */}
        <div className="hidden md:flex items-center gap-2.5 flex-shrink-0">
          {/* Desktop Location Badge (when on medium screens) */}
          {location && (
            <div className="hidden md:flex lg:hidden items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 max-w-[160px] truncate">
              <MapPin size={13} className="text-indigo-400 flex-shrink-0" />
              <span className="text-xs text-slate-300 font-medium truncate">{location.name}</span>
            </div>
          )}

          <button
            className="btn-ghost !py-2 !px-3.5 flex items-center gap-2 rounded-xl text-xs font-semibold"
            onClick={onDetectLocation}
            disabled={detecting}
            aria-label="Use my current location"
          >
            {detecting ? (
              <Loader size={14} className="animate-spin text-cyan-400" />
            ) : (
              <Navigation size={14} className="text-cyan-400" />
            )}
            <span>{detecting ? 'Locating...' : 'My Location'}</span>
          </button>

          <button
            className="btn-ghost !p-2.5 flex items-center justify-center rounded-xl"
            onClick={onOpenSettings}
            aria-label="Open settings"
            title="Settings"
          >
            <Settings size={16} className="text-slate-300" />
          </button>
        </div>
      </div>
    </header>
  );
}

