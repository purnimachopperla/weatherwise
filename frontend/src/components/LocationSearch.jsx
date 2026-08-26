/**
 * LocationSearch.jsx — City search input with autocomplete dropdown.
 *
 * Fully responsive:
 * - Full-width on mobile with comfortable 44px touch targets
 * - Prevents mobile viewport shifts
 * - Clean dropdown with high z-index and tap feedback
 */

import { useState, useRef, useEffect } from 'react';
import { Search, X, MapPin, Loader } from 'lucide-react';
import { searchLocation } from '../services/weatherApi';

// Debounce helper: wait 350ms after typing before making an API call
function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

export default function LocationSearch({ onSelectLocation, placeholder = 'Search city (e.g. Hyderabad, Mumbai)...' }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);
  const debouncedQuery = useDebounce(query, 350);

  // Perform search when debounced query changes
  useEffect(() => {
    if (debouncedQuery.length < 2) {
      setResults([]);
      setOpen(false);
      return;
    }
    let isCurrent = true;
    const doSearch = async () => {
      setSearching(true);
      setSearchError('');
      try {
        const data = await searchLocation(debouncedQuery);
        if (!isCurrent) return;
        setResults(data);
        setOpen(true);
        if (data.length === 0) {
          setSearchError(`No cities found for "${debouncedQuery}"`);
        }
      } catch (err) {
        if (!isCurrent) return;
        setSearchError('Search unavailable. Check connection.');
        setResults([]);
      } finally {
        if (isCurrent) setSearching(false);
      }
    };
    doSearch();
    return () => { isCurrent = false; };
  }, [debouncedQuery]);

  // Close dropdown when clicking outside or pressing Escape
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleSelect = (loc) => {
    setQuery('');
    setResults([]);
    setOpen(false);
    onSelectLocation({
      name: loc.name,
      country: loc.country,
      latitude: loc.latitude,
      longitude: loc.longitude,
    });
  };

  const clearSearch = () => {
    setQuery('');
    setResults([]);
    setOpen(false);
    setSearchError('');
  };

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Search Input Box */}
      <div
        className="flex items-center gap-2.5 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-full bg-slate-900/90 border border-indigo-500/30 hover:border-indigo-500/50 focus-within:border-cyan-400 focus-within:ring-2 focus-within:ring-cyan-500/20 transition-all duration-200 shadow-inner"
      >
        {searching ? (
          <Loader size={16} className="text-cyan-400 animate-spin flex-shrink-0" />
        ) : (
          <Search size={16} className="text-indigo-400 flex-shrink-0" />
        )}
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          aria-label="Search for a city"
          className="flex-1 bg-transparent border-none outline-none text-slate-100 text-sm sm:text-base placeholder:text-slate-500 min-w-0"
          onFocus={() => { if (results.length > 0) setOpen(true); }}
        />
        {query && (
          <button
            onClick={clearSearch}
            aria-label="Clear search"
            className="p-1 text-slate-400 hover:text-slate-200 rounded-full hover:bg-slate-800/60 transition-colors flex-shrink-0"
          >
            <X size={15} />
          </button>
        )}
      </div>

      {/* Dropdown Results */}
      {open && (
        <div
          className="absolute top-full left-0 right-0 mt-2 bg-slate-950/95 backdrop-blur-2xl border border-indigo-500/30 rounded-2xl overflow-hidden z-[100] shadow-2xl shadow-black/80 max-h-[320px] overflow-y-auto"
        >
          {searchError && results.length === 0 ? (
            <div className="p-4 text-center text-slate-400 text-sm">
              {searchError}
            </div>
          ) : (
            results.map((loc, i) => (
              <button
                key={`${loc.name}-${loc.latitude}-${i}`}
                onClick={() => handleSelect(loc)}
                className="flex items-center gap-3 w-full px-4 py-3.5 text-left border-b border-indigo-500/10 last:border-b-0 hover:bg-indigo-500/15 active:bg-indigo-500/25 transition-colors group cursor-pointer"
              >
                <div className="w-7 h-7 rounded-lg bg-indigo-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-indigo-500/20">
                  <MapPin size={14} className="text-indigo-400 group-hover:text-cyan-300" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-slate-100 text-sm font-semibold truncate group-hover:text-cyan-300">
                    {loc.name}
                  </p>
                  {(loc.admin1 || loc.country) && (
                    <p className="text-slate-400 text-xs truncate">
                      {[loc.admin1, loc.country].filter(Boolean).join(', ')}
                    </p>
                  )}
                </div>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}

