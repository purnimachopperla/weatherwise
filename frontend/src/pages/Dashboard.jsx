/**
 * Dashboard.jsx — The main page of WeatherWise.
 *
 * Orchestrates all components and manages application state.
 * Fully responsive: adapts layout smoothly from 320px mobile to 1920px widescreen.
 */

import { useState, useEffect, useCallback } from 'react';
import { RefreshCw, AlertTriangle } from 'lucide-react';

import Header from '../components/Header';
import ProfileSelector from '../components/ProfileSelector';
import CurrentWeather from '../components/CurrentWeather';
import WeatherStats from '../components/WeatherStats';
import AQICard from '../components/AQICard';
import HourlyForecast from '../components/HourlyForecast';
import Forecast from '../components/Forecast';
import WeatherAlerts from '../components/WeatherAlerts';
import RecommendationCard from '../components/RecommendationCard';
import WeatherChart from '../components/WeatherChart';
import SavedLocations from '../components/SavedLocations';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';

import { useRecommendation } from '../hooks/useWeather';
import {
  fetchWeather, fetchAirQuality, fetchAlerts,
  getSavedLocations, saveLocation, deleteSavedLocation,
  reverseGeocode,
} from '../services/weatherApi';
import { getOrCreateSessionId } from '../utils/weatherUtils';


// Default starting location
const DEFAULT_LOCATION = {
  name: 'Hyderabad',
  country: 'India',
  latitude: 17.385,
  longitude: 78.4867,
};

export default function Dashboard({ onOpenSettings }) {
  // ── State ──────────────────────────────────────────────
  const [location, setLocation] = useState(DEFAULT_LOCATION);
  const [profile, setProfile] = useState('health');
  const [weather, setWeather] = useState(null);
  const [airQuality, setAirQuality] = useState(null);
  const [alerts, setAlerts] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [savedLocations, setSavedLocations] = useState([]);
  const [locationError, setLocationError] = useState(null);
  const [detecting, setDetecting] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(null);

  const sessionId = getOrCreateSessionId();

  // Recommendation updates separately when profile changes
  const {
    recommendation,
    loading: recLoading,
  } = useRecommendation(location.latitude, location.longitude, location.name, profile);

  // ── Fetch all weather data ────────────────────────────
  const fetchAll = useCallback(async (loc = location) => {
    if (!loc?.latitude || !loc?.longitude) return;
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
      setError(err.message || 'Failed to load weather data. Please check connection.');
    } finally {
      setLoading(false);
    }
  }, [location]);

  // Fetch when location changes
  useEffect(() => {
    fetchAll(location);
  }, [location.latitude, location.longitude]);

  // ── Load saved locations on mount ─────────────────────
  useEffect(() => {
    const loadSaved = async () => {
      try {
        const locs = await getSavedLocations(sessionId);
        setSavedLocations(locs);
      } catch {
        // Silently ignore — non-critical
      }
    };
    loadSaved();
  }, [sessionId]);

  // ── Location handlers ─────────────────────────────────
  const handleSelectLocation = (loc) => {
    setLocation({
      name: loc.name,
      country: loc.country || '',
      latitude: loc.latitude,
      longitude: loc.longitude,
    });
  };

  const handleDetectLocation = async () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser.');
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

      // Reverse geocode
      let name = 'Your Location', country = '';
      try {
        const data = await reverseGeocode(latitude, longitude);
        name = data.name || name;
        country = data.country || country;
      } catch {}


      setLocation({ name, country, latitude, longitude });
    } catch (err) {
      const msgs = {
        1: 'Location permission denied. Please allow access or search for a city.',
        2: 'Unable to determine location. Please search for a city.',
        3: 'Location detection timed out. Please search for a city.',
      };
      setLocationError(msgs[err.code] || 'Unable to detect location. Please search manually.');
    } finally {
      setDetecting(false);
    }
  };

  // ── Saved Location handlers ───────────────────────────
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
      setSavedLocations(locs);
    } catch (err) {
      console.error('Failed to save location:', err);
    }
  };

  const handleRemoveLocation = async (locationId) => {
    try {
      await deleteSavedLocation(locationId, sessionId);
      setSavedLocations((prev) => prev.filter((l) => l.id !== locationId));
    } catch (err) {
      console.error('Failed to remove location:', err);
    }
  };

  // ── Profile change ────────────────────────────────────
  const handleProfileChange = (newProfile) => {
    setProfile(newProfile);
  };

  // ── Render ────────────────────────────────────────────
  return (
    <div className="min-h-screen relative overflow-x-hidden">
      {/* Background ambient orbs */}
      <div className="bg-orb bg-orb-1" />
      <div className="bg-orb bg-orb-2" />
      <div className="bg-orb bg-orb-3" />

      {/* Header */}
      <Header
        location={location}
        onSelectLocation={handleSelectLocation}
        onDetectLocation={handleDetectLocation}
        detecting={detecting}
        onOpenSettings={onOpenSettings}
      />

      {/* Main content container */}
      <main className="max-w-[1400px] mx-auto px-3 sm:px-6 lg:px-8 py-3.5 sm:py-6 pb-16 sm:pb-20">
        {/* Location detection error banner */}
        {locationError && (
          <div className="flex items-center gap-3 p-3 sm:p-3.5 mb-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs sm:text-sm">
            <AlertTriangle size={16} className="text-amber-400 flex-shrink-0" />
            <p className="flex-1 text-slate-200">{locationError}</p>
            <button
              onClick={() => setLocationError(null)}
              className="text-slate-400 hover:text-white px-1.5 py-0.5 text-lg leading-none cursor-pointer"
            >
              ×
            </button>
          </div>
        )}

        {/* Profile Selector */}
        <div className="mb-4 sm:mb-6">
          <ProfileSelector activeProfile={profile} onProfileChange={handleProfileChange} />
        </div>

        {/* Loading state */}
        {loading && !weather && <LoadingState />}

        {/* Error state */}
        {error && !loading && !weather && (
          <ErrorState
            message={error}
            onRetry={() => fetchAll(location)}
            onSearch={() => {}}
          />
        )}

        {/* Dashboard content */}
        {weather && (
          <>
            {/* Last update + Refresh bar */}
            <div className="flex justify-between items-center mb-3 sm:mb-4">
              <p className="text-[11px] sm:text-xs text-slate-400 font-medium">
                {lastRefresh && `Live • Updated ${lastRefresh.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
              </p>
              <button
                className="btn-ghost !py-1.5 !px-3 text-xs font-semibold rounded-xl flex items-center gap-1.5"
                onClick={() => fetchAll(location)}
              >
                <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
                <span>Refresh</span>
              </button>
            </div>

            {/* ── Responsive Main Grid ── */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] xl:grid-cols-[1fr_400px] gap-4 sm:gap-5 items-start">
              {/* ─ LEFT COLUMN: Main Weather, Stats, Alerts, Forecasts & Charts ─ */}
              <div className="flex flex-col gap-4 sm:gap-5 min-w-0">
                {/* Hero Weather Card */}
                <CurrentWeather weather={weather} location={location} />

                {/* Weather Stats Grid */}
                <WeatherStats weather={weather} airQuality={airQuality} />

                {/* Active Alerts (if any) */}
                {alerts?.alerts?.length > 0 && <WeatherAlerts alerts={alerts} />}

                {/* Hourly Forecast */}
                <HourlyForecast weather={weather} />

                {/* 7-Day Forecast */}
                <Forecast weather={weather} />

                {/* Interactive Trends Charts */}
                <WeatherChart weather={weather} />
              </div>

              {/* ─ RIGHT COLUMN: Recommendation, AQI Gauge & Saved Locations ─ */}
              <div className="flex flex-col gap-4 sm:gap-5 min-w-0">
                {/* Personalized Recommendation Card */}
                <RecommendationCard recommendation={recommendation} loading={recLoading} />

                {/* AQI Breakdown */}
                <AQICard airQuality={airQuality} />

                {/* Saved Locations */}
                <SavedLocations
                  savedLocations={savedLocations}
                  currentLocation={location}
                  onSelectLocation={handleSelectLocation}
                  onRemoveLocation={handleRemoveLocation}
                  onSaveCurrentLocation={handleSaveCurrentLocation}
                />
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

