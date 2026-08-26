/**
 * LocationSearch.jsx — Professional location autocomplete search component.
 */

import { useState, useRef, useEffect } from 'react';
import { Search, X, MapPin, Loader } from 'lucide-react';
import { searchLocation } from '../services/weatherApi';

function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

export default function LocationSearch({ onSelectLocation, placeholder = 'Search city or region (e.g. Hyderabad, Delhi, Bengaluru)...' }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);
  const debouncedQuery = useDebounce(query, 350);

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
          setSearchError(`No locations found for "${debouncedQuery}"`);
        }
      } catch (err) {
        if (!isCurrent) return;
        setSearchError('Search service temporarily unreachable.');
        setResults([]);
      } finally {
        if (isCurrent) setSearching(false);
      }
    };
    doSearch();
    return () => { isCurrent = false; };
  }, [debouncedQuery]);

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
        className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-300 focus-within:bg-white focus-within:border-teal-700 focus-within:ring-2 focus-within:ring-teal-700/10 transition-all shadow-2xs"
      >
        {searching ? (
          <Loader size={15} className="text-teal-700 animate-spin flex-shrink-0" />
        ) : (
          <Search size={15} className="text-slate-400 flex-shrink-0" />
        )}
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          aria-label="Search for a city or region"
          className="flex-1 bg-transparent border-none outline-none text-slate-900 text-xs sm:text-sm placeholder:text-slate-400 min-w-0"
          onFocus={() => { if (results.length > 0) setOpen(true); }}
        />
        {query && (
          <button
            onClick={clearSearch}
            aria-label="Clear search"
            className="p-1 text-slate-400 hover:text-slate-700 rounded-md hover:bg-slate-200/50 transition-colors flex-shrink-0"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Dropdown Results */}
      {open && (
        <div
          className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-slate-200 rounded-xl overflow-hidden z-[100] shadow-lg max-h-[300px] overflow-y-auto"
        >
          {searchError && results.length === 0 ? (
            <div className="p-3.5 text-center text-slate-500 text-xs">
              {searchError}
            </div>
          ) : (
            results.map((loc, i) => (
              <button
                key={`${loc.name}-${loc.latitude}-${i}`}
                onClick={() => handleSelect(loc)}
                className="flex items-center gap-3 w-full px-3.5 py-2.5 text-left border-b border-slate-100 last:border-b-0 hover:bg-slate-50 active:bg-slate-100 transition-colors group cursor-pointer"
              >
                <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0 group-hover:bg-teal-50">
                  <MapPin size={13} className="text-slate-500 group-hover:text-teal-700" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-slate-800 text-xs sm:text-sm font-semibold truncate group-hover:text-teal-900">
                    {loc.name}
                  </p>
                  {(loc.admin1 || loc.country) && (
                    <p className="text-slate-400 text-[11px] truncate">
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
