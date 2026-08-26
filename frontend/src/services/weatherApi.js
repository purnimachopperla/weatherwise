/**
 * weatherApi.js — Centralized API service for the React frontend.
 *
 * All calls to the backend go through this file with graceful error parsing.
 */

import axios from 'axios';

const envApiUrl = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || '';
const cleanApiUrl = envApiUrl ? envApiUrl.trim().replace(/\/+$/, '') : '';

export const API_URL = cleanApiUrl || (import.meta.env.DEV ? 'http://localhost:8000' : '');

export const API_BASE = cleanApiUrl
  ? (cleanApiUrl.endsWith('/api') ? cleanApiUrl : `${cleanApiUrl}/api`)
  : '/api';

const api = axios.create({
  baseURL: API_BASE,
  timeout: 20000,
});

function handleError(error, context) {
  if (error.response) {
    const status = error.response.status;
    const detail = error.response.data?.detail || error.response.statusText;
    const customError = new Error(detail || `${context} request failed (${status})`);
    customError.status = status;
    customError.isRateLimited = status === 429 || (typeof detail === 'string' && detail.toLowerCase().includes('rate-limit'));
    throw customError;
  } else if (error.request) {
    const customError = new Error('Cannot connect to WeatherWise telemetry service. Please verify your network connection.');
    customError.status = 0;
    throw customError;
  } else {
    throw new Error(`${context}: ${error.message}`);
  }
}

export async function checkHealth(signal) {
  try {
    const { data } = await api.get('/health', { signal });
    return data;
  } catch (error) {
    handleError(error, 'Health check');
  }
}

export async function fetchWeather(lat, lon, locationName = 'Unknown', signal) {
  try {
    const { data } = await api.get('/weather', {
      params: { latitude: lat, longitude: lon, location: locationName },
      signal,
    });
    return data;
  } catch (error) {
    handleError(error, 'Weather telemetry');
  }
}

export async function fetchAirQuality(lat, lon, locationName = 'Unknown', signal) {
  try {
    const { data } = await api.get('/air-quality', {
      params: { latitude: lat, longitude: lon, location: locationName },
      signal,
    });
    return data;
  } catch (error) {
    handleError(error, 'Air quality telemetry');
  }
}

export async function fetchAlerts(lat, lon, locationName = 'Unknown', signal) {
  try {
    const { data } = await api.get('/alerts', {
      params: { latitude: lat, longitude: lon, location: locationName },
      signal,
    });
    return data;
  } catch (error) {
    handleError(error, 'Alerts telemetry');
  }
}

export async function fetchRecommendation(lat, lon, profile, locationName = 'Unknown', signal) {
  try {
    const { data } = await api.get('/recommendation', {
      params: { latitude: lat, longitude: lon, profile, location: locationName },
      signal,
    });
    return data;
  } catch (error) {
    handleError(error, 'Recommendation engine');
  }
}

export async function searchLocation(query, signal) {
  try {
    const { data } = await api.get('/location/search', {
      params: { query },
      signal,
    });
    return data.results || [];
  } catch (error) {
    handleError(error, 'Location search');
  }
}

export async function reverseGeocode(lat, lon, signal) {
  try {
    const { data } = await api.get('/location/reverse', {
      params: { latitude: lat, longitude: lon },
      signal,
    });
    return data;
  } catch (error) {
    handleError(error, 'Reverse geocoding');
  }
}

export async function getSavedLocations(sessionId, signal) {
  try {
    const { data } = await api.get(`/saved-locations/${sessionId}`, { signal });
    return data.locations || [];
  } catch (error) {
    handleError(error, 'Saved locations');
  }
}

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
