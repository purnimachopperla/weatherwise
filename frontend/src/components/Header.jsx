/**
 * Header.jsx — Centered, balanced application navigation bar.
 *
 * Fully responsive:
 * - Desktop (1024px to 1920px+): Sleek single-row layout with centered search bar
 * - Mobile/Tablet: Clean 2-row layout with full-width search and comfortable touch targets
 */

import { Navigation, Loader, MapPin, Settings } from 'lucide-react';
import LocationSearch from './LocationSearch';

export default function Header({ location, onSelectLocation, onDetectLocation, detecting, onOpenSettings }) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-indigo-500/20 bg-slate-950/90 backdrop-blur-xl py-2.5 sm:py-3">
      <div className="dashboard-container flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
        {/* Top bar on mobile / Left group on desktop */}
        <div className="flex items-center justify-between gap-3 sm:gap-4 flex-shrink-0">
          {/* Logo */}
          <div className="flex items-center gap-2.5 flex-shrink-0">
            <div
              className="w-9 h-9 rounded-2xl flex items-center justify-center text-lg shadow-md shadow-indigo-500/25"
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

          {/* Current Location Badge (tablet/mobile) */}
          {location && (
            <div className="hidden sm:flex md:hidden items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex-shrink-0 max-w-[200px] truncate">
              <MapPin size={12} className="text-indigo-400 flex-shrink-0" />
              <span className="text-xs text-slate-300 font-medium truncate">
                {location.name}{location.country ? `, ${location.country}` : ''}
              </span>
            </div>
          )}

          {/* Mobile Action Buttons (My Location & Settings) */}
          <div className="flex items-center gap-2 md:hidden">
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

        {/* Search input (centered on desktop, full-width on mobile) */}
        <div className="flex-1 w-full max-w-full md:max-w-[480px] lg:max-w-[560px] mx-auto">
          <LocationSearch onSelectLocation={onSelectLocation} />
        </div>

        {/* Desktop Action Buttons */}
        <div className="hidden md:flex items-center gap-2.5 flex-shrink-0">
          {/* Desktop Location Badge */}
          {location && (
            <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 max-w-[200px] truncate">
              <MapPin size={13} className="text-indigo-400 flex-shrink-0" />
              <span className="text-xs text-slate-300 font-medium truncate">
                {location.name}{location.country ? `, ${location.country}` : ''}
              </span>
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
