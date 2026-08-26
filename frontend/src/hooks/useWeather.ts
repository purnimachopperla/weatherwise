import { useState, useEffect, useCallback, useRef } from 'react';
import type {
  WeatherResponse,
  AirQualityResponse,
  RecommendationResponse,
  AlertsResponse,
  UserProfile,
} from '../types/weather';
import {
  fetchWeather,
  fetchAirQuality,
  fetchRecommendations,
  fetchAlerts,
} from '../services/api';

interface LocationState {
  name: string;
  country: string;
  latitude: number;
  longitude: number;
}

export const useWeather = (
  location: LocationState,
  profile: UserProfile
) => {
  const [weather, setWeather] = useState<WeatherResponse | null>(null);
  const [airQuality, setAirQuality] = useState<AirQualityResponse | null>(null);
  const [recommendation, setRecommendation] = useState<RecommendationResponse | null>(null);
  const [alerts, setAlerts] = useState<AlertsResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const isFirstMount = useRef(true);

  const loadData = useCallback(
    async (isManualRefresh = false) => {
      // Validate coordinates
      if (
        location.latitude === undefined ||
        location.longitude === undefined ||
        isNaN(location.latitude) ||
        isNaN(location.longitude)
      ) {
        return;
      }

      if (isManualRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError(null);
      try {
        console.log(`[useWeather] Fetching live telemetry for ${location.name} (${location.latitude}, ${location.longitude})`);
        const [weatherData, aqData, recData, alertsData] = await Promise.all([
          fetchWeather(location.latitude, location.longitude, location.name),
          fetchAirQuality(location.latitude, location.longitude, location.name),
          fetchRecommendations(location.latitude, location.longitude, profile, location.name),
          fetchAlerts(location.latitude, location.longitude, location.name),
        ]);

        setWeather(weatherData);
        setAirQuality(aqData);
        setRecommendation(recData);
        setAlerts(alertsData);
        setLastUpdated(new Date());
      } catch (err: unknown) {
        console.error('[useWeather] Error fetching live data from backend', err);
        setError('Unable to fetch live telemetry from backend. Please ensure the backend server is running.');
      } finally {
        setLoading(false);
        setRefreshing(false);
        isFirstMount.current = false;
      }
    },
    [location.latitude, location.longitude, location.name, profile]
  );

  // Trigger data load whenever location or profile changes
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Auto refresh live telemetry every 5 minutes
  useEffect(() => {
    const timer = setInterval(() => {
      loadData(true);
    }, 5 * 60 * 1000);
    return () => clearInterval(timer);
  }, [loadData]);

  return {
    weather,
    airQuality,
    recommendation,
    alerts,
    loading,
    refreshing,
    error,
    lastUpdated,
    refresh: () => loadData(true),
  };
};
