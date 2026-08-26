/**
 * Dashboard.jsx — Redesigned Modern WeatherWise Application Experience.
 *
 * Visual hierarchy:
 * 1. Clean sticky top header with search & settings
 * 2. Lifestyle persona horizontal selection strip
 * 3. Hero Current Weather Section (Main focal point)
 * 4. 6-metric responsive weather stats bar
 * 5. Full-width Personalized Lifestyle Guidance section
 * 6. 24-hour horizontal forecast carousel
 * 7. Two-column split layout:
 *    - Left: 7-Day daily forecast with temperature range bars
 *    - Right: Air Quality gauge & 24h interactive trends
 * 8. Quick-switch saved locations strip
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
import { RefreshCw, AlertTriangle } from 'lucide-react';

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
    fetchRec,
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
        setError(err.message || 'Failed to load weather data. Please check connection.');
      } finally {
        setLoading(false);
      }
    },
    [location]
  );

  useEffect(() => {
    fetchAll(location);
  }, [location.latitude, location.longitude]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Load saved locations on mount ─────────────────────
  useEffect(() => {
    const loadSaved = async () => {
      try {
        const locs = await getSavedLocations(sessionId);
        if (locs) setSavedLocations(locs);
      } catch {
        // Non-critical background load
      }
    };
    loadSaved();
  }, [sessionId]);

  // ── Location Selection ─────────────────────────────────
  const handleSelectLocation = (loc) => {
    setLocation({
      name: loc.name,
      country: loc.country || '',
      latitude: loc.latitude,
      longitude: loc.longitude,
    });
    setLocationError(null);
  };

  // ── Geolocation Detection ──────────────────────────────
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

      let name = 'Your Location', country = '';
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
        1: 'Location permission denied. Please allow access or search for a city.',
        2: 'Unable to determine location. Please search for a city.',
        3: 'Location detection timed out. Please search for a city.',
      };
      setLocationError(msgs[err.code] || 'Unable to detect location. Please search manually.');
    } finally {
      setDetecting(false);
    }
  };

  // ── Saved Locations Management ─────────────────────────
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

  // ── Profile Change ─────────────────────────────────────
  const handleProfileChange = (newProfile) => {
    setProfile(newProfile);
  };

  // ── Render ────────────────────────────────────────────
  return (
    <div className="app-shell">
      {/* Background ambient orbs */}
      <div className="bg-orb bg-orb-1" />
      <div className="bg-orb bg-orb-2" />

      {/* Sticky Header */}
      <Header
        location={location}
        onSelectLocation={handleSelectLocation}
        onDetectLocation={handleDetectLocation}
        detecting={detecting}
        onOpenSettings={onOpenSettings}
      />

      {/* Main content stream */}
      <main className="dashboard-container py-6 sm:py-8 pb-20 space-y-6 sm:space-y-8">
        {/* Geolocation error banner */}
        {locationError && (
          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs sm:text-sm fade-in">
            <AlertTriangle size={16} className="text-amber-400 flex-shrink-0" />
            <p className="flex-1 text-slate-200">{locationError}</p>
            <button
              onClick={() => setLocationError(null)}
              className="text-slate-400 hover:text-white px-2 py-0.5 text-lg leading-none cursor-pointer"
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

        {/* Live Weather Content */}
        {weather && (
          <>
            {/* Live refresh & timestamp bar */}
            <div className="flex justify-between items-center px-1">
              <p className="text-xs text-slate-400 font-medium">
                {lastRefresh && `Live Weather • Updated ${lastRefresh.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
              </p>
              <button
                className="btn-ghost !py-1 !px-3 text-xs font-semibold rounded-xl flex items-center gap-1.5"
                onClick={() => fetchAll(location)}
              >
                <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
                <span>Refresh</span>
              </button>
            </div>

            {/* 2. Hero Weather Section */}
            <CurrentWeather weather={weather} location={location} />

            {/* 3. Weather Metrics Grid (6 tiles) */}
            <WeatherStats weather={weather} airQuality={airQuality} />

            {/* 4. Full-Width Personalized Lifestyle Guidance */}
            <RecommendationCard
              recommendation={recommendation}
              loading={recLoading}
            />

            {/* 5. Active Weather Warnings (when present) */}
            {alerts?.alerts?.length > 0 && <WeatherAlerts alerts={alerts} />}

            {/* 6. 24-Hour Forecast Carousel */}
            <HourlyForecast weather={weather} />

            {/* 7. Two-Column Split: 7-Day Forecast & (AQI + Charts) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
              {/* Left Column: 7-Day Forecast */}
              <div className="flex flex-col">
                <Forecast weather={weather} />
              </div>

              {/* Right Column: Air Quality Gauge + 24h Trend Charts */}
              <div className="flex flex-col gap-5 sm:gap-6">
                <AQICard airQuality={airQuality} />
                <WeatherChart weather={weather} />
              </div>
            </div>

            {/* 8. Quick-Switch Saved Locations Strip */}
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
