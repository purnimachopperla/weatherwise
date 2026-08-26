import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Bookmark,
  MapPin,
  Trash2,
  Plus,
  Compass,
} from 'lucide-react';
import type { SavedLocation } from '../types/weather';
import { LocationSearch } from './LocationSearch';

interface SavedLocationsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  savedLocations: SavedLocation[];
  onSelectLocation: (loc: { name: string; country: string; latitude: number; longitude: number }) => void;
  onRemoveLocation: (id: string | number, name: string) => void;
  onAddLocation: (loc: { name: string; country?: string; latitude: number; longitude: number }) => void;
  currentLocationName: string;
}

export const SavedLocationsDrawer: React.FC<SavedLocationsDrawerProps> = ({
  isOpen,
  onClose,
  savedLocations,
  onSelectLocation,
  onRemoveLocation,
  onAddLocation,
  currentLocationName,
}) => {
  const [showAddSearch, setShowAddSearch] = useState(false);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          <div className="absolute inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10 w-full sm:w-auto">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-full sm:w-screen sm:max-w-md bg-dark-950/95 backdrop-blur-2xl border-l border-white/10 p-4 sm:p-6 flex flex-col justify-between shadow-2xl"
            >
              <div>
                <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-white/10">
                  <div className="flex items-center gap-2 sm:gap-2.5">
                    <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                      <Bookmark className="w-4 h-4" />
                    </div>
                    <div>
                      <h2 className="font-display text-base sm:text-lg font-bold text-white">
                        Saved Locations
                      </h2>
                      <p className="text-[11px] sm:text-xs text-slate-400">
                        {savedLocations.length} bookmarked spots
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="my-4">
                  {showAddSearch ? (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs text-slate-400">
                        <span>Search city to add:</span>
                        <button
                          onClick={() => setShowAddSearch(false)}
                          className="text-cyan-400 hover:underline"
                        >
                          Cancel
                        </button>
                      </div>
                      <LocationSearch
                        onSelectLocation={(loc) => {
                          onAddLocation(loc);
                          setShowAddSearch(false);
                        }}
                        currentLocationName={currentLocationName}
                      />
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowAddSearch(true)}
                      className="w-full py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-200 transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Plus className="w-4 h-4 text-cyan-400" />
                      <span>Bookmark New Location</span>
                    </button>
                  )}
                </div>

                <div className="space-y-2.5 max-h-[calc(100vh-280px)] overflow-y-auto custom-scrollbar pr-1">
                  {savedLocations.length === 0 ? (
                    <div className="py-12 text-center text-slate-400 space-y-2">
                      <Compass className="w-8 h-8 mx-auto text-slate-600 animate-spin-slow" />
                      <p className="text-sm">No saved locations yet.</p>
                      <p className="text-xs text-slate-400">
                        Click the bookmark icon on any city to pin it here.
                      </p>
                    </div>
                  ) : (
                    savedLocations.map((item) => {
                      const isCurrent =
                        item.name.toLowerCase() === currentLocationName.toLowerCase();

                      return (
                        <div
                          key={item.id || item.name}
                          className={`p-3.5 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                            isCurrent
                              ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/10 border-cyan-500/40 text-white shadow-glow-cyan'
                              : 'bg-dark-900/60 hover:bg-dark-900 border-white/5 text-slate-300'
                          }`}
                        >
                          <button
                            onClick={() => {
                              onSelectLocation({
                                name: item.name,
                                country: item.country || '',
                                latitude: item.latitude,
                                longitude: item.longitude,
                              });
                              onClose();
                            }}
                            className="flex items-center gap-3 text-left flex-1 cursor-pointer"
                          >
                            <MapPin className={`w-4 h-4 ${isCurrent ? 'text-cyan-400' : 'text-slate-400'}`} />
                            <div>
                              <div className="font-semibold text-sm text-slate-100 flex items-center gap-2">
                                <span>{item.name}</span>
                                {isCurrent && (
                                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-cyan-400/20 text-cyan-300 font-bold uppercase">
                                    Active
                                  </span>
                                )}
                              </div>
                              <div className="text-xs text-slate-400">
                                {item.country || `${item.latitude.toFixed(2)}°, ${item.longitude.toFixed(2)}°`}
                              </div>
                            </div>
                          </button>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onRemoveLocation(item.id || '', item.name);
                            }}
                            title="Remove location"
                            className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 text-center text-xs text-slate-400">
                Synced with session SQLite & local cache
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
