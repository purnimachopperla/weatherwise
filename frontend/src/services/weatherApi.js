/**
 * weatherApi.js — Centralized API service for the React frontend.
 *
 * All calls to the backend go through this file.
 * Never put API calls directly inside components!
 * This makes it easy to change the base URL in one place.
 */

import axios from 'axios';

// The base URL points to our FastAPI backend.
// In development, Vite proxies /api to http://localhost:8000
// In production, VITE_API_URL (or VITE_API_BASE_URL) points to the public Render backend URL.
const envApiUrl = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || '';
const cleanApiUrl = envApiUrl ? envApiUrl.trim().replace(/\/+$/, '') : '';

export const API_URL = cleanApiUrl || (import.meta.env.DEV ? 'http://localhost:8000' : '');

// If cleanApiUrl already ends with /api, use it as is; otherwise append /api
export const API_BASE = cleanApiUrl
  ? (cleanApiUrl.endsWith('/api') ? cleanApiUrl : `${cleanApiUrl}/api`)
  : '/api';

// Create an axios instance with default settings
const api = axios.create({
  baseURL: API_BASE,
  timeout: 20000, // 20 seconds before giving up on cold-starts
});


// ─────────────────────────────────────────────────────────────────────────────
// Helper: handle errors gracefully
// ─────────────────────────────────────────────────────────────────────────────
function handleError(error, context) {
  if (error.response) {
    // Server responded with an error status (4xx, 5xx)
    const msg = error.response.data?.detail || error.response.statusText;
    throw new Error(`${context}: ${msg}`);
  } else if (error.request) {
    // Request was made but no response received (server down, network error)
    throw new Error(`Cannot connect to WeatherWise server. Is the backend running on port 8000?`);
  } else {
    // Something else went wrong
    throw new Error(`${context}: ${error.message}`);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// API Functions
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Check if the backend server is healthy and running.
 */
export async function checkHealth() {
  try {
    const { data } = await api.get('/health');
    return data;
  } catch (error) {
    handleError(error, 'Health check');
  }
}

/**
 * Fetch current weather + hourly + 7-day forecast.
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @param {string} locationName - City name (for display)
 */
export async function fetchWeather(lat, lon, locationName = 'Unknown') {
  try {
    const { data } = await api.get('/weather', {
      params: { latitude: lat, longitude: lon, location: locationName },
    });
    return data;
  } catch (error) {
    handleError(error, 'Weather data');
  }
}

/**
 * Fetch air quality data (AQI, PM2.5, PM10, ozone, UV).
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @param {string} locationName - City name (for display)
 */
export async function fetchAirQuality(lat, lon, locationName = 'Unknown') {
  try {
    const { data } = await api.get('/air-quality', {
      params: { latitude: lat, longitude: lon, location: locationName },
    });
    return data;
  } catch (error) {
    handleError(error, 'Air quality data');
  }
}

/**
 * Fetch weather alerts for a location.
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @param {string} locationName - City name
 */
export async function fetchAlerts(lat, lon, locationName = 'Unknown') {
  try {
    const { data } = await api.get('/alerts', {
      params: { latitude: lat, longitude: lon, location: locationName },
    });
    return data;
  } catch (error) {
    handleError(error, 'Alerts');
  }
}

/**
 * Fetch personalized recommendations for a user profile.
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @param {string} profile - Profile key (health|fitness|travel|family|agriculture|commuter|beach|event)
 * @param {string} locationName - City name
 */
export async function fetchRecommendation(lat, lon, profile, locationName = 'Unknown') {
  try {
    const { data } = await api.get('/recommendation', {
      params: { latitude: lat, longitude: lon, profile, location: locationName },
    });
    return data;
  } catch (error) {
    handleError(error, 'Recommendation');
  }
}

/**
 * Search for a city by name.
 * @param {string} query - City name to search
 */
export async function searchLocation(query) {
  try {
    const { data } = await api.get('/location/search', {
      params: { query },
    });
    return data.results || [];
  } catch (error) {
    handleError(error, 'Location search');
  }
}

/**
 * Convert coordinates to a city name (reverse geocoding).
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 */
export async function reverseGeocode(lat, lon) {
  try {
    const { data } = await api.get('/location/reverse', {
      params: { latitude: lat, longitude: lon },
    });
    return data;
  } catch (error) {
    handleError(error, 'Reverse geocoding');
  }
}

/**
 * Get all saved locations for a user session.
 * @param {string} sessionId - Browser session ID
 */
export async function getSavedLocations(sessionId) {
  try {
    const { data } = await api.get(`/saved-locations/${sessionId}`);
    return data.locations || [];
  } catch (error) {
    handleError(error, 'Saved locations');
  }
}

/**
 * Save a location to the user's list.
 */
export async function saveLocation({ sessionId, name, country, latitude, longitude }) {
  try {
    const { data } = await api.post('/saved-locations', null, {
      params: { session_id: sessionId, name, country, latitude, longitude },
    });
    return data;
  } catch (error) {
    handleError(error, 'Save location');
  }
}

/**
 * Remove a saved location.
 * @param {number} locationId - Database ID of the saved location
 * @param {string} sessionId - Browser session ID
 */
export async function deleteSavedLocation(locationId, sessionId) {
  try {
    const { data } = await api.delete(`/saved-locations/${locationId}`, {
      params: { session_id: sessionId },
    });
    return data;
  } catch (error) {
    handleError(error, 'Delete location');
  }
}
