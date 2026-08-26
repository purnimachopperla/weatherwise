import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Loader2, X, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { searchLocations } from '../services/api';
import type { LocationSearchResult } from '../types/weather';

interface LocationSearchProps {
  onSelectLocation: (location: { name: string; country: string; latitude: number; longitude: number }) => void;
  currentLocationName: string;
}

export const LocationSearch: React.FC<LocationSearchProps> = ({
  onSelectLocation,
  currentLocationName,
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<LocationSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const handler = setTimeout(async () => {
      const data = await searchLocations(query.trim());
      setResults(data);
      setLoading(false);
      setSelectedIndex(-1);
    }, 300);

    return () => clearTimeout(handler);
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (item: LocationSearchResult) => {
    onSelectLocation({
      name: item.name,
      country: item.country || '',
      latitude: item.latitude,
      longitude: item.longitude,
    });
    setQuery('');
    setIsOpen(false);
    setResults([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && selectedIndex < results.length) {
        handleSelect(results[selectedIndex]);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const popularCities = [
    { name: 'Tokyo', country: 'Japan', latitude: 35.6762, longitude: 139.6503 },
    { name: 'London', country: 'United Kingdom', latitude: 51.5074, longitude: -0.1278 },
    { name: 'New York', country: 'United States', latitude: 40.7128, longitude: -74.006 },
    { name: 'Paris', country: 'France', latitude: 48.8566, longitude: 2.3522 },
    { name: 'Singapore', country: 'Singapore', latitude: 1.3521, longitude: 103.8198 },
  ];

  return (
    <div ref={containerRef} className="relative w-full max-w-md">
      <div className="relative flex items-center">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={`Search city (current: ${currentLocationName})...`}
          className="w-full pl-10 pr-9 py-2.5 bg-dark-900/80 hover:bg-dark-900 focus:bg-dark-900 text-sm text-slate-100 placeholder-slate-400 rounded-xl border border-white/10 focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-200 shadow-inner"
        />
        {query ? (
          <button
            onClick={() => {
              setQuery('');
              setResults([]);
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        ) : loading ? (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-400 animate-spin" />
        ) : null}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 right-0 mt-2 z-50 bg-dark-900/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl overflow-hidden"
          >
            {results.length > 0 ? (
              <div className="py-1.5 max-h-64 overflow-y-auto custom-scrollbar divide-y divide-white/5">
                {results.map((item, idx) => (
                  <button
                    key={`${item.name}-${item.latitude}-${item.longitude}-${idx}`}
                    onClick={() => handleSelect(item)}
                    className={`w-full px-4 py-2.5 flex items-center justify-between text-left transition-colors ${
                      idx === selectedIndex ? 'bg-cyan-500/20 text-cyan-200' : 'hover:bg-white/5 text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <MapPin className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                      <div>
                        <div className="text-sm font-medium text-slate-100">{item.name}</div>
                        <div className="text-xs text-slate-400">
                          {[item.admin1, item.country].filter(Boolean).join(', ')}
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {item.latitude.toFixed(2)}°, {item.longitude.toFixed(2)}°
                    </span>
                  </button>
                ))}
              </div>
            ) : query.trim().length >= 2 && !loading ? (
              <div className="p-4 text-center text-sm text-slate-400">
                No matching locations found for "{query}".
              </div>
            ) : (
              <div className="p-3">
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-2 mb-2 flex items-center gap-1.5">
                  <Globe className="w-3 h-3 text-cyan-400" />
                  Popular Global Cities
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  {popularCities.map((city) => (
                    <button
                      key={city.name}
                      onClick={() => handleSelect(city)}
                      className="px-2.5 py-1.5 rounded-lg text-left text-xs text-slate-300 hover:bg-white/10 hover:text-white transition-colors flex items-center gap-2"
                    >
                      <MapPin className="w-3 h-3 text-cyan-400/70" />
                      <span className="truncate">{city.name}, {city.country}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
