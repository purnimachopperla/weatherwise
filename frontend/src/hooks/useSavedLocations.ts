import { useState, useEffect, useCallback } from 'react';
import type { SavedLocation } from '../types/weather';
import {
  fetchSavedLocations,
  saveLocationToBackend,
  deleteLocationFromBackend,
} from '../services/api';

const STORAGE_KEY = 'weatherwise_saved_locations';
const SESSION_KEY = 'weatherwise_session_id';

const getSessionId = (): string => {
  let id = localStorage.getItem(SESSION_KEY);
  if (!id) {
    id = 'user_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now();
    localStorage.setItem(SESSION_KEY, id);
  }
  return id;
};

const defaultLocations: SavedLocation[] = [
  { id: '1', name: 'Tokyo', country: 'Japan', latitude: 35.6762, longitude: 139.6503 },
  { id: '2', name: 'London', country: 'United Kingdom', latitude: 51.5074, longitude: -0.1278 },
  { id: '3', name: 'New York', country: 'United States', latitude: 40.7128, longitude: -74.006 },
  { id: '4', name: 'Paris', country: 'France', latitude: 48.8566, longitude: 2.3522 },
];

export const useSavedLocations = () => {
  const [savedLocations, setSavedLocations] = useState<SavedLocation[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : defaultLocations;
    } catch {
      return defaultLocations;
    }
  });

  const sessionId = getSessionId();

  // Sync with backend on mount
  useEffect(() => {
    const syncBackend = async () => {
      try {
        const backendLocs = await fetchSavedLocations(sessionId);
        if (backendLocs && backendLocs.length > 0) {
          setSavedLocations((prev) => {
            const merged = [...backendLocs];
            prev.forEach((p) => {
              if (!merged.some((m) => m.name.toLowerCase() === p.name.toLowerCase())) {
                merged.push(p);
              }
            });
            return merged;
          });
        }
      } catch (err) {
        console.warn('Backend sync failed', err);
      }
    };
    syncBackend();
  }, [sessionId]);

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(savedLocations));
  }, [savedLocations]);

  const addLocation = useCallback(
    async (loc: { name: string; country?: string; latitude: number; longitude: number }) => {
      const exists = savedLocations.some(
        (item) => item.name.toLowerCase() === loc.name.toLowerCase()
      );
      if (exists) return;

      const newLocation: SavedLocation = {
        id: 'loc_' + Date.now(),
        name: loc.name,
        country: loc.country || '',
        latitude: loc.latitude,
        longitude: loc.longitude,
      };

      setSavedLocations((prev) => [newLocation, ...prev]);

      // Attempt backend persistence
      saveLocationToBackend(sessionId, loc);
    },
    [savedLocations, sessionId]
  );

  const removeLocation = useCallback(
    async (id: string | number, name: string) => {
      setSavedLocations((prev) => prev.filter((item) => item.id !== id && item.name !== name));
      deleteLocationFromBackend(id, sessionId);
    },
    [sessionId]
  );

  const isLocationSaved = useCallback(
    (name: string) => {
      return savedLocations.some((item) => item.name.toLowerCase() === name.toLowerCase());
    },
    [savedLocations]
  );

  return {
    savedLocations,
    addLocation,
    removeLocation,
    isLocationSaved,
  };
};
