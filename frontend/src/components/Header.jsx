/**
 * Header.jsx — Enterprise Environmental Intelligence Top Navigation.
 *
 * Professional, clean header compliant with Government / SIH presentation guidelines.
 */

import { Navigation, Loader, MapPin, Settings, ShieldCheck, Activity } from 'lucide-react';
import LocationSearch from './LocationSearch';

export default function Header({ location, onSelectLocation, onDetectLocation, detecting, onOpenSettings }) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur-md py-2.5 sm:py-3 shadow-xs">
      <div className="dashboard-container flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
        {/* Brand & Platform Crest */}
        <div className="flex items-center justify-between gap-3 sm:gap-4 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-teal-700 text-white flex items-center justify-center shadow-xs">
              <ShieldCheck size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight leading-none">
                  WeatherWise
                </h1>
                <span className="text-[10px] font-bold text-teal-800 bg-teal-50 border border-teal-200/80 px-2 py-0.5 rounded-md hidden xs:inline-block">
                  SIH 2024
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium tracking-normal mt-0.5">
                Environmental Decision Intelligence Platform
              </p>
            </div>
          </div>

          {/* Mobile Buttons */}
          <div className="flex items-center gap-1.5 md:hidden">
            <button
              className="btn-ghost !p-2 !min-h-[36px] !min-w-[36px] flex items-center justify-center rounded-lg"
              onClick={onDetectLocation}
              disabled={detecting}
              aria-label="Locate Device"
              title="Use current location"
            >
              {detecting ? (
                <Loader size={16} className="animate-spin text-teal-700" />
              ) : (
                <Navigation size={16} className="text-slate-600" />
              )}
            </button>

            <button
              className="btn-ghost !p-2 !min-h-[36px] !min-w-[36px] flex items-center justify-center rounded-lg"
              onClick={onOpenSettings}
              aria-label="Platform Information & Settings"
              title="Settings & Data Sources"
            >
              <Settings size={16} className="text-slate-600" />
            </button>
          </div>
        </div>

        {/* Center Search Input */}
        <div className="flex-1 w-full max-w-full md:max-w-[440px] lg:max-w-[520px] mx-auto">
          <LocationSearch onSelectLocation={onSelectLocation} />
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-2.5 flex-shrink-0">
          {location && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 text-xs font-medium text-slate-700 max-w-[200px] truncate">
              <MapPin size={13} className="text-teal-700 flex-shrink-0" />
              <span className="truncate">{location.name}{location.country ? `, ${location.country}` : ''}</span>
            </div>
          )}

          <button
            className="btn-secondary !py-1.5 !px-3 text-xs font-semibold rounded-lg flex items-center gap-1.5"
            onClick={onDetectLocation}
            disabled={detecting}
            aria-label="Detect GPS Location"
          >
            {detecting ? (
              <Loader size={13} className="animate-spin text-teal-700" />
            ) : (
              <Navigation size={13} className="text-slate-600" />
            )}
            <span>{detecting ? 'Locating...' : 'My Location'}</span>
          </button>

          <button
            className="btn-ghost !p-2 flex items-center justify-center rounded-lg"
            onClick={onOpenSettings}
            aria-label="Open settings and about"
            title="Platform Settings & Sources"
          >
            <Settings size={15} className="text-slate-600" />
          </button>
        </div>
      </div>
    </header>
  );
}
