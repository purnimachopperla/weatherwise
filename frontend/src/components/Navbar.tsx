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
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-dark-950/70 border-b border-white/5 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
        {/* Brand Logo & Tag */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/30 border border-cyan-500/30 shadow-glow-cyan">
            <CloudSun className="w-5 h-5 text-cyan-400" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-dark-950 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 font-display font-bold text-lg tracking-tight text-white">
              <span>Weather</span>
              <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Wise
              </span>
            </div>
            <div className="text-[10px] text-slate-400 font-medium tracking-wide flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5 text-cyan-400" />
              <span>Environmental Intelligence</span>
            </div>
          </div>
        </div>

        {/* Central Search Bar */}
        <div className="flex-1 max-w-md mx-2 hidden sm:block">
          <LocationSearch
            onSelectLocation={onSelectLocation}
            currentLocationName={currentLocationName}
          />
        </div>

        {/* Right Actions & Utilities */}
        <div className="flex items-center gap-2">
          {/* GPS Auto Detect */}
          <button
            onClick={handleUseCurrentLocation}
            disabled={gpsLoading}
            title="Detect your live physical location (GPS / IP)"
            className="p-2.5 rounded-xl bg-dark-900/80 hover:bg-dark-800 text-slate-300 hover:text-cyan-300 border border-white/10 hover:border-cyan-500/30 transition-all flex items-center gap-1.5 text-xs font-medium cursor-pointer"
          >
            <Navigation
              className={`w-4 h-4 text-cyan-400 ${gpsLoading ? 'animate-spin' : ''}`}
            />
            <span className="hidden md:inline">
              {gpsLoading ? 'Locating...' : 'Live GPS'}
            </span>
          </button>

          {/* Unit Switcher */}
          <button
            onClick={onToggleTempUnit}
            title="Toggle Celsius / Fahrenheit"
            className="px-3 py-2 rounded-xl bg-dark-900/80 hover:bg-dark-800 text-slate-200 border border-white/10 hover:border-white/20 transition-all font-mono text-xs font-semibold flex items-center gap-1 cursor-pointer"
          >
            <span className={tempUnit === 'celsius' ? 'text-cyan-400' : 'text-slate-500'}>
              °C
            </span>
            <span className="text-slate-600">|</span>
            <span className={tempUnit === 'fahrenheit' ? 'text-cyan-400' : 'text-slate-500'}>
              °F
            </span>
          </button>

          {/* Saved Locations Drawer Trigger */}
          <button
            onClick={onOpenSavedLocations}
            title="View saved locations"
            className="relative p-2.5 rounded-xl bg-dark-900/80 hover:bg-dark-800 text-slate-300 hover:text-amber-300 border border-white/10 hover:border-amber-500/30 transition-all cursor-pointer"
          >
            <Bookmark className="w-4 h-4 text-amber-400" />
            {savedCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 rounded-full bg-amber-500 text-[9px] font-bold text-dark-950 flex items-center justify-center">
                {savedCount}
              </span>
            )}
          </button>

          {/* Manual Refresh */}
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            title="Refresh real-time weather telemetry"
            className="p-2.5 rounded-xl bg-dark-900/80 hover:bg-dark-800 text-slate-300 hover:text-white border border-white/10 hover:border-white/20 transition-all cursor-pointer"
          >
            <RefreshCw
              className={`w-4 h-4 text-slate-400 ${isRefreshing ? 'animate-spin text-cyan-400' : ''}`}
            />
          </button>
        </div>
      </div>

      {/* Mobile Search Bar Row */}
      <div className="px-4 pb-3 sm:hidden">
        <LocationSearch
          onSelectLocation={onSelectLocation}
          currentLocationName={currentLocationName}
        />
      </div>
    </header>
  );
};
