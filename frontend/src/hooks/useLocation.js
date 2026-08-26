/**
 * useLocation.js — Custom React hook for location detection.
 *
 * Handles:
 *  - Browser geolocation ("Use My Location" button)
 *  - Reverse geocoding (lat/lon → city name)
 *  - Managing the current location state
 */

import { useState, useCallback } from 'react';
import { reverseGeocode } from '../services/weatherApi';

// Default location: Hyderabad, India
// (Shown when the user hasn't selected a location yet)
const DEFAULT_LOCATION = {
  name: 'Hyderabad',
  country: 'India',
  latitude: 17.385,
  longitude: 78.4867,
};

export function useLocation() {
  const [location, setLocation] = useState(null);
  const [detecting, setDetecting] = useState(false);
  const [locationError, setLocationError] = useState(null);

  /**
   * Request the browser for the user's current location.
   * If permission is denied, show a friendly message.
   */
  const detectLocation = useCallback(async () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser. Please search for a city manually.');
      return;
    }

    setDetecting(true);
    setLocationError(null);

    // Wrap the callback-based geolocation API in a Promise
    const getPosition = () =>
      new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          timeout: 10000,
          enableHighAccuracy: false,
        });
      });

    try {
      const position = await getPosition();
      const { latitude, longitude } = position.coords;

      // Convert coordinates to a city name
      let name = 'Your Location';
      let country = '';
      try {
        const geocoded = await reverseGeocode(latitude, longitude);
        name = geocoded.name || name;
        country = geocoded.country || country;
      } catch {
        // If reverse geocoding fails, just show coordinates
      }

      setLocation({ name, country, latitude, longitude });
    } catch (err) {
      // Handle specific geolocation errors with friendly messages
      if (err.code === 1) {
        setLocationError('Location permission denied. Please search for a city manually, or allow location access in your browser settings.');
      } else if (err.code === 2) {
        setLocationError('Unable to determine your location. Please search for a city manually.');
      } else if (err.code === 3) {
        setLocationError('Location detection timed out. Please search for a city manually.');
      } else {
        setLocationError('Unable to detect your location. Please search for a city manually.');
      }
    } finally {
      setDetecting(false);
    }
  }, []);

  /**
   * Manually set the location (used after a search result is selected).
   * @param {{ name, country, latitude, longitude }} loc
   */
  const selectLocation = useCallback((loc) => {
    setLocation(loc);
    setLocationError(null);
  }, []);

  /**
   * Load the default location (Hyderabad) as a fallback.
   */
  const loadDefault = useCallback(() => {
    setLocation(DEFAULT_LOCATION);
    setLocationError(null);
  }, []);

  return {
    location,
    detecting,
    locationError,
    detectLocation,
    selectLocation,
    loadDefault,
    clearLocationError: () => setLocationError(null),
  };
}
