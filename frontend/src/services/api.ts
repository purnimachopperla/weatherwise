import axios from 'axios';
import type {
  WeatherResponse,
  AirQualityResponse,
  RecommendationResponse,
  AlertsResponse,
  LocationSearchResult,
  UserProfile,
  SavedLocation,
} from '../types/weather';

// Normalize API Base URL so it works whether VITE_API_URL is:
// - undefined (defaults to '/api' for local Vite proxy / Vercel rewrites)
// - "https://weatherwise-vr0t.onrender.com"
// - "https://weatherwise-vr0t.onrender.com/"
// - "https://weatherwise-vr0t.onrender.com/api"
const resolveApiBase = (): string => {
  const envUrl = (import.meta.env.VITE_API_URL as string)?.trim();
  if (!envUrl) {
    return '/api';
  }
  const clean = envUrl.replace(/\/+$/, '');
  return clean.endsWith('/api') ? clean : `${clean}/api`;
};

const API_BASE = resolveApiBase();

const api = axios.create({
  baseURL: API_BASE,
  timeout: 45000, // 45s timeout to handle Render free-tier cold starts
});

export const fetchWeather = async (
  latitude: number,
  longitude: number,
  location: string
): Promise<WeatherResponse> => {
  const { data } = await api.get<WeatherResponse>('/weather', {
    params: { latitude, longitude, location },
  });
  return data;
};

export const fetchAirQuality = async (
  latitude: number,
  longitude: number,
  location: string
): Promise<AirQualityResponse> => {
  const { data } = await api.get<AirQualityResponse>('/air-quality', {
    params: { latitude, longitude, location },
  });
  return data;
};

export const fetchRecommendations = async (
  latitude: number,
  longitude: number,
  profile: UserProfile,
  location: string
): Promise<RecommendationResponse> => {
  const { data } = await api.get<RecommendationResponse>('/recommendation', {
    params: { latitude, longitude, profile, location },
  });
  return data;
};

export const fetchAlerts = async (
  latitude: number,
  longitude: number,
  location: string
): Promise<AlertsResponse> => {
  const { data } = await api.get<AlertsResponse>('/alerts', {
    params: { latitude, longitude, location },
  });
  return data;
};

export const searchLocations = async (query: string): Promise<LocationSearchResult[]> => {
  if (!query || query.trim().length < 2) return [];
  try {
    const { data } = await api.get<{ results: LocationSearchResult[] }>('/location/search', {
      params: { query },
    });
    return data.results || [];
  } catch (error) {
    console.warn('[API] Search unavailable', error);
    return [];
  }
};

export const reverseGeocode = async (
  latitude: number,
  longitude: number
): Promise<LocationSearchResult> => {
  const { data } = await api.get<LocationSearchResult>('/location/reverse', {
    params: { latitude, longitude },
  });
  return data;
};

export const fetchSavedLocations = async (sessionId: string): Promise<SavedLocation[]> => {
  try {
    const { data } = await api.get<{ locations: SavedLocation[] }>(`/saved-locations/${sessionId}`);
    return data.locations || [];
  } catch (error) {
    console.warn('[API] Saved locations fetch unavailable', error);
    return [];
  }
};

export const saveLocationToBackend = async (
  sessionId: string,
  location: { name: string; country?: string; latitude: number; longitude: number }
): Promise<void> => {
  try {
    await api.post('/saved-locations', null, {
      params: {
        session_id: sessionId,
        name: location.name,
        country: location.country || '',
        latitude: location.latitude,
        longitude: location.longitude,
      },
    });
  } catch (error) {
    console.warn('[API] Could not save location to backend', error);
  }
};

export const deleteLocationFromBackend = async (
  locationId: number | string,
  sessionId: string
): Promise<void> => {
  try {
    await api.delete(`/saved-locations/${locationId}`, {
      params: { session_id: sessionId },
    });
  } catch (error) {
    console.warn('[API] Could not delete saved location from backend', error);
  }
};
