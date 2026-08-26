/**
 * Dashboard.jsx — Environmental Decision Intelligence Platform (SIH 2024 Edition).
 *
 * Professional Architecture:
 * 1. Enterprise Top Navigation with Telemetry Status
 * 2. Stakeholder Decision Persona Selector
 * 3. Environmental Status Hero with Safety Score & Risk Classification
 * 4. Key Environmental Telemetry Grid (6 Metrics)
 * 5. Environmental Intelligence Engine & Multi-Parameter Advisory
 * 6. 24-Hour Hourly Telemetry Carousel
 * 7. Two-Column Analytical Split: 7-Day Tabular Forecast & (AQI + Trends)
 * 8. Monitored Telemetry Stations
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import Header from '../components/Header';
import ProfileSelector from '../components/ProfileSelector';
import CurrentWeather from '../components/CurrentWeather';
import WeatherStats from '../components/WeatherStats';
import HourlyForecast from '../components/HourlyForecast';
import Forecast from '../components/Forecast';
import RecommendationCard from '../components/RecommendationCard';
import AQICard from '../components/AQICard';
import WeatherChart from '../components/WeatherChart';
import WeatherAlerts from '../components/WeatherAlerts';
import SavedLocations from '../components/SavedLocations';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';

import {
  fetchWeather,
  fetchAirQuality,
  fetchAlerts,
  reverseGeocode,
  getSavedLocations,
  saveLocation,
  deleteSavedLocation,
} from '../services/weatherApi';
import { useRecommendation } from '../hooks/useWeather';
import { RefreshCw, AlertTriangle, Radio } from 'lucide-react';

const DEFAULT_LOCATION = {
  name: 'Hyderabad',
  country: 'India',
  latitude: 17.3850,
  longitude: 78.4867,
};

function getOrCreateSessionId() {
  let id = localStorage.getItem('weatherwise_session_id');
  if (!id) {
    id = 'session_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now();
    localStorage.setItem('weatherwise_session_id', id);
  }
  return id;
}

export default function Dashboard({ onOpenSettings }) {
  const sessionId = useMemo(() => getOrCreateSessionId(), []);

  // ── State ──────────────────────────────────────────────
  const [location, setLocation] = useState(DEFAULT_LOCATION);
  const [profile, setProfile] = useState('health');
  const [weather, setWeather] = useState(null);
  const [airQuality, setAirQuality] = useState(null);
  const [alerts, setAlerts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [savedLocations, setSavedLocations] = useState([]);
  const [locationError, setLocationError] = useState(null);
  const [detecting, setDetecting] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(null);

  const {
    recommendation,
    loading: recLoading,
  } = useRecommendation(location.latitude, location.longitude, location.name, profile);

  // ── Data Fetching ──────────────────────────────────────
  const fetchAll = useCallback(
    async (loc = location) => {
      setLoading(true);
      setError(null);
      try {
        const [w, aq, al] = await Promise.all([
          fetchWeather(loc.latitude, loc.longitude, loc.name),
          fetchAirQuality(loc.latitude, loc.longitude, loc.name),
          fetchAlerts(loc.latitude, loc.longitude, loc.name),
        ]);
        setWeather(w);
        setAirQuality(aq);
        setAlerts(al);
        setLastRefresh(new Date());
      } catch (err) {
        setError(err.message || 'Telemetry link failure. Please check network connection.');
      } finally {
        setLoading(false);
      }
    },
    [location]
  );

  useEffect(() => {
    fetchAll(location);
  }, [location.latitude, location.longitude]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Load saved stations on mount ───────────────────────
  useEffect(() => {
    const loadSaved = async () => {
      try {
        const locs = await getSavedLocations(sessionId);
        if (locs) setSavedLocations(locs);
      } catch {
        // Non-critical background telemetry load
      }
    };
    loadSaved();
  }, [sessionId]);

  // ── Location Handlers ──────────────────────────────────
  const handleSelectLocation = (loc) => {
    setLocation({
      name: loc.name,
      country: loc.country || '',
      latitude: loc.latitude,
      longitude: loc.longitude,
    });
    setLocationError(null);
  };

  const handleDetectLocation = async () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation telemetry is not supported by this browser.');
      return;
    }
    setDetecting(true);
    setLocationError(null);

    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          timeout: 10000,
          enableHighAccuracy: false,
        });
      });

      const { latitude, longitude } = position.coords;

      let name = 'Current Telemetry Station', country = '';
      try {
        const data = await reverseGeocode(latitude, longitude);
        name = data.name || name;
        country = data.country || country;
      } catch {
        // Non-critical reverse geocode fallback
      }

      setLocation({ name, country, latitude, longitude });
    } catch (err) {
      const msgs = {
        1: 'Location permission denied by user. Search a city manually.',
        2: 'GPS signal acquisition unavailable. Search a city manually.',
        3: 'Location telemetry timed out. Search a city manually.',
      };
      setLocationError(msgs[err.code] || 'Unable to detect position. Please search manually.');
    } finally {
      setDetecting(false);
    }
  };

  // ── Saved Stations Handlers ────────────────────────────
  const handleSaveCurrentLocation = async () => {
    try {
      await saveLocation({
        sessionId,
        name: location.name,
        country: location.country || '',
        latitude: location.latitude,
        longitude: location.longitude,
      });
      const locs = await getSavedLocations(sessionId);
      if (locs) setSavedLocations(locs);
    } catch (err) {
      console.error('Failed to register station:', err);
    }
  };

  const handleRemoveLocation = async (locationId) => {
    try {
      await deleteSavedLocation(locationId, sessionId);
      setSavedLocations((prev) => prev.filter((l) => l.id !== locationId));
    } catch (err) {
      console.error('Failed to remove station:', err);
    }
  };

  const handleProfileChange = (newProfile) => {
    setProfile(newProfile);
  };

  // ── Render ────────────────────────────────────────────
  return (
    <div className="app-shell">
      {/* Top Header */}
      <Header
        location={location}
        onSelectLocation={handleSelectLocation}
        onDetectLocation={handleDetectLocation}
        detecting={detecting}
        onOpenSettings={onOpenSettings}
      />

      {/* Main Content Flow */}
      <main className="dashboard-container py-5 sm:py-6 pb-20 space-y-5 sm:space-y-6">
        {/* Geolocation Alert Banner */}
        {locationError && (
          <div className="flex items-center gap-3 p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs sm:text-sm fade-in">
            <AlertTriangle size={16} className="text-amber-600 flex-shrink-0" />
            <p className="flex-1 font-medium">{locationError}</p>
            <button
              onClick={() => setLocationError(null)}
              className="text-amber-700 hover:text-amber-900 px-2 py-0.5 text-lg leading-none cursor-pointer"
            >
              ×
            </button>
          </div>
        )}

        {/* 1. Persona Profile Selector Strip */}
        <ProfileSelector activeProfile={profile} onProfileChange={handleProfileChange} />

        {/* Loading Skeleton */}
        {loading && !weather && <LoadingState />}

        {/* Error Fallback */}
        {error && !loading && !weather && (
          <ErrorState
            message={error}
            onRetry={() => fetchAll(location)}
            onSearch={() => {}}
          />
        )}

        {/* Live Environmental Dashboard Content */}
        {weather && (
          <>
            {/* Live Telemetry Status Bar */}
            <div className="flex justify-between items-center px-0.5 text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-semibold text-slate-700">Live Station Feed</span>
                <span className="hidden sm:inline text-slate-400">
                  {lastRefresh && `• Synchronized ${lastRefresh.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}`}
                </span>
              </div>
              <button
                className="btn-ghost !py-1 !px-2.5 text-xs font-semibold rounded-lg flex items-center gap-1.5"
                onClick={() => fetchAll(location)}
              >
                <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
                <span>Sync Now</span>
              </button>
            </div>

            {/* 2. Hero Environmental Status & Safety Index */}
            <CurrentWeather
              weather={weather}
              location={location}
              airQuality={airQuality}
            />

            {/* 3. Key Environmental Telemetry Grid (6 Tiles) */}
            <WeatherStats weather={weather} airQuality={airQuality} />

            {/* 4. Core Innovation: Environmental Intelligence & Decision Engine */}
            <RecommendationCard
              recommendation={recommendation}
              loading={recLoading}
              airQuality={airQuality}
              weather={weather}
            />

            {/* 5. Active Warnings (when present) */}
            {alerts?.alerts?.length > 0 && <WeatherAlerts alerts={alerts} />}

            {/* 6. 24-Hour Telemetry Forecast Carousel */}
            <HourlyForecast weather={weather} />

            {/* 7. Two-Column Analytical Grid: 7-Day Tabular Forecast & (AQI + Charts) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start">
              {/* Left Column: 7-Day Environmental Forecast Table (lg:col-span-6) */}
              <div className="lg:col-span-6 flex flex-col h-full">
                <Forecast weather={weather} airQuality={airQuality} />
              </div>

              {/* Right Column: Air Quality Pollution Breakdown & 24h Trend Charts (lg:col-span-6) */}
              <div className="lg:col-span-6 flex flex-col gap-5 sm:gap-6">
                <AQICard airQuality={airQuality} />
                <WeatherChart weather={weather} airQuality={airQuality} />
              </div>
            </div>

            {/* 8. Monitored Telemetry Stations */}
            <SavedLocations
              savedLocations={savedLocations}
              currentLocation={location}
              onSelectLocation={handleSelectLocation}
              onRemoveLocation={handleRemoveLocation}
              onSaveCurrentLocation={handleSaveCurrentLocation}
            />
          </>
        )}
      </main>
    </div>
  );
}
