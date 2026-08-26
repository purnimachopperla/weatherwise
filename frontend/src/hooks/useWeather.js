/**
 * useWeather.js — Custom React hook for fetching all weather data.
 *
 * This hook manages the entire data-fetching lifecycle:
 *  - loading states
 *  - error handling
 *  - parallel API calls (weather + air quality + alerts + recommendation)
 *
 * Usage:
 *   const { weather, airQuality, alerts, recommendation, loading, error } = useWeather(lat, lon, locationName, profile);
 */

import { useState, useEffect, useCallback } from 'react';
import {
  fetchWeather,
  fetchAirQuality,
  fetchAlerts,
  fetchRecommendation,
} from '../services/weatherApi';

export function useWeather(lat, lon, locationName, profile) {
  const [weather, setWeather] = useState(null);
  const [airQuality, setAirQuality] = useState(null);
  const [alerts, setAlerts] = useState(null);
  const [recommendation, setRecommendation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAllData = useCallback(async () => {
    // Don't fetch if no coordinates are available yet
    if (!lat || !lon) return;

    setLoading(true);
    setError(null);

    try {
      // Fetch weather and air quality in parallel (faster than sequential)
      const [weatherData, aqData, alertsData] = await Promise.all([
        fetchWeather(lat, lon, locationName),
        fetchAirQuality(lat, lon, locationName),
        fetchAlerts(lat, lon, locationName),
      ]);

      setWeather(weatherData);
      setAirQuality(aqData);
      setAlerts(alertsData);

      // Fetch recommendation separately (depends on profile)
      const recData = await fetchRecommendation(lat, lon, profile, locationName);
      setRecommendation(recData);

    } catch (err) {
      setError(err.message || 'Failed to load weather data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [lat, lon, locationName, profile]);

  // Re-fetch whenever the location or profile changes
  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  return {
    weather,
    airQuality,
    alerts,
    recommendation,
    loading,
    error,
    refetch: fetchAllData,
  };
}

/**
 * useRecommendation — Fetch just the recommendation when profile changes.
 * Used to avoid re-fetching weather data when only profile changes.
 */
export function useRecommendation(lat, lon, locationName, profile) {
  const [recommendation, setRecommendation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchRec = useCallback(async () => {
    if (!lat || !lon || !profile) return;
    setLoading(true);
    setError(null);
    try {
      const data = await fetchRecommendation(lat, lon, profile, locationName);
      setRecommendation(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [lat, lon, locationName, profile]);

  useEffect(() => {
    fetchRec();
  }, [fetchRec]);

  return { recommendation, loading, error, refetch: fetchRec };
}
