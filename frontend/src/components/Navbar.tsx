import React, { useState } from 'react';
import {
  CloudSun,
  Navigation,
  Bookmark,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import type { TemperatureUnit } from '../types/weather';
import { LocationSearch } from './LocationSearch';
import { detectLiveLocation } from '../utils/geolocation';

interface NavbarProps {
  currentLocationName: string;
  onSelectLocation: (loc: { name: string; country: string; latitude: number; longitude: number }) => void;
  tempUnit: TemperatureUnit;
  onToggleTempUnit: () => void;
  onOpenSavedLocations: () => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  savedCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentLocationName,
  onSelectLocation,
  tempUnit,
  onToggleTempUnit,
  onOpenSavedLocations,
  onRefresh,
  isRefreshing,
  savedCount,
}) => {
  const [gpsLoading, setGpsLoading] = useState(false);

  const handleUseCurrentLocation = async () => {
    setGpsLoading(true);
    try {
      const loc = await detectLiveLocation();
      onSelectLocation({
        name: loc.name,
        country: loc.country,
        latitude: loc.latitude,
        longitude: loc.longitude,
      });
    } catch (err) {
      console.warn('Geolocation detection error', err);
    } finally {
      setGpsLoading(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-dark-950/75 border-b border-white/5 transition-all">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-2 sm:gap-3">
        {/* Brand Logo & Tag */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          <div className="relative flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/30 border border-cyan-500/30 shadow-glow-cyan">
            <CloudSun className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" />
            <span className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full bg-emerald-400 ring-2 ring-dark-950 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1 font-display font-bold text-base sm:text-lg tracking-tight text-white">
              <span>Weather</span>
              <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Wise
              </span>
            </div>
            <div className="hidden min-[400px]:flex text-[9px] sm:text-[10px] text-slate-400 font-medium tracking-wide items-center gap-1">
              <Sparkles className="w-2.5 h-2.5 text-cyan-400" />
              <span>Environmental Intel</span>
            </div>
          </div>
        </div>

        {/* Central Search Bar (Desktop) */}
        <div className="flex-1 max-w-md mx-2 hidden sm:block">
          <LocationSearch
            onSelectLocation={onSelectLocation}
            currentLocationName={currentLocationName}
          />
        </div>

        {/* Right Actions & Utilities */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* GPS Auto Detect */}
          <button
            onClick={handleUseCurrentLocation}
            disabled={gpsLoading}
            title="Detect your live physical location (GPS / IP)"
            className="p-2 sm:p-2.5 rounded-xl bg-dark-900/80 hover:bg-dark-800 text-slate-300 hover:text-cyan-300 border border-white/10 hover:border-cyan-500/30 transition-all flex items-center gap-1.5 text-xs font-medium cursor-pointer active:scale-95"
          >
            <Navigation
              className={`w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-400 ${gpsLoading ? 'animate-spin' : ''}`}
            />
            <span className="hidden md:inline">
              {gpsLoading ? 'Locating...' : 'Live GPS'}
            </span>
          </button>

          {/* Unit Switcher */}
          <button
            onClick={onToggleTempUnit}
            title="Toggle Celsius / Fahrenheit"
            className="px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl bg-dark-900/80 hover:bg-dark-800 text-slate-200 border border-white/10 hover:border-white/20 transition-all font-mono text-xs font-semibold flex items-center gap-1 cursor-pointer active:scale-95"
          >
            <span className={tempUnit === 'celsius' ? 'text-cyan-400 font-bold' : 'text-slate-500'}>
              °C
            </span>
            <span className="text-slate-600">|</span>
            <span className={tempUnit === 'fahrenheit' ? 'text-cyan-400 font-bold' : 'text-slate-500'}>
              °F
            </span>
          </button>

          {/* Saved Locations Drawer Trigger */}
          <button
            onClick={onOpenSavedLocations}
            title="View saved locations"
            className="relative p-2 sm:p-2.5 rounded-xl bg-dark-900/80 hover:bg-dark-800 text-slate-300 hover:text-amber-300 border border-white/10 hover:border-amber-500/30 transition-all cursor-pointer active:scale-95"
          >
            <Bookmark className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />
            {savedCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[15px] h-3.5 sm:h-4 px-1 rounded-full bg-amber-500 text-[8px] sm:text-[9px] font-bold text-dark-950 flex items-center justify-center">
                {savedCount}
              </span>
            )}
          </button>

          {/* Manual Refresh */}
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            title="Refresh real-time weather telemetry"
            className="p-2 sm:p-2.5 rounded-xl bg-dark-900/80 hover:bg-dark-800 text-slate-300 hover:text-white border border-white/10 hover:border-white/20 transition-all cursor-pointer active:scale-95"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400 ${isRefreshing ? 'animate-spin text-cyan-400' : ''}`}
            />
          </button>
        </div>
      </div>

      {/* Mobile Search Bar Row */}
      <div className="px-3 pb-2.5 sm:hidden">
        <LocationSearch
          onSelectLocation={onSelectLocation}
          currentLocationName={currentLocationName}
        />
      </div>
    </header>
  );
};
