import { useState, useEffect } from 'react';
import type { UserProfile, TemperatureUnit } from './types/weather';
import { useWeather } from './hooks/useWeather';
import { useSavedLocations } from './hooks/useSavedLocations';
import { Navbar } from './components/Navbar';
import { ProfileSelector } from './components/ProfileSelector';
import { HeroWeatherCard } from './components/HeroWeatherCard';
import { WeatherStatsGrid } from './components/WeatherStatsGrid';
import { AQICard } from './components/AQICard';
import { RecommendationCard } from './components/RecommendationCard';
import { SmartAlerts } from './components/SmartAlerts';
import { HourlyForecast } from './components/HourlyForecast';
import { DailyForecast } from './components/DailyForecast';
import { WeatherChart } from './components/WeatherChart';
import { CelestialOrbitArc } from './components/CelestialOrbitArc';
import { WeatherRadarMap } from './components/WeatherRadarMap';
import { WeatherParticleCanvas } from './components/WeatherParticleCanvas';
import { SoundscapePlayer } from './components/SoundscapePlayer';
import { SavedLocationsDrawer } from './components/SavedLocationsDrawer';
import { WeatherBackground } from './components/WeatherBackground';
import { SkeletonLoader } from './components/SkeletonLoader';
import { ErrorBanner } from './components/ErrorBanner';
import { detectLiveLocation } from './utils/geolocation';

export function App() {
  const [selectedProfile, setSelectedProfile] = useState<UserProfile>('health');
  const [tempUnit, setTempUnit] = useState<TemperatureUnit>('celsius');
  const [isSavedDrawerOpen, setIsSavedDrawerOpen] = useState<boolean>(false);
  const [particlesEnabled, setParticlesEnabled] = useState<boolean>(true);

  // Initial location state
  const [activeLocation, setActiveLocation] = useState({
    name: 'Locating...',
    country: '',
    latitude: 51.5074,
    longitude: -0.1278,
  });

  // Automatically detect user's live physical location on startup
  useEffect(() => {
    const initLocation = async () => {
      try {
        const detected = await detectLiveLocation();
        setActiveLocation({
          name: detected.name,
          country: detected.country,
          latitude: detected.latitude,
          longitude: detected.longitude,
        });
      } catch (err) {
        console.warn('Initial live location detection failed, using fallback', err);
        setActiveLocation({
          name: 'London',
          country: 'United Kingdom',
          latitude: 51.5074,
          longitude: -0.1278,
        });
      }
    };

    initLocation();
  }, []);

  const {
    weather,
    airQuality,
    recommendation,
    alerts,
    loading,
    refreshing,
    error,
    refresh,
  } = useWeather(activeLocation, selectedProfile);

  const {
    savedLocations,
    addLocation,
    removeLocation,
    isLocationSaved,
  } = useSavedLocations();

  const handleSelectLocation = (loc: {
    name: string;
    country: string;
    latitude: number;
    longitude: number;
  }) => {
    setActiveLocation(loc);
  };

  const isCurrentSaved = isLocationSaved(activeLocation.name);

  const handleToggleSaveCurrent = () => {
    if (isCurrentSaved) {
      removeLocation('', activeLocation.name);
    } else {
      addLocation(activeLocation);
    }
  };

  const todayForecast = weather?.daily?.[0];

  return (
    <div className="min-h-screen text-slate-100 relative selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Dynamic Background Ambient Canvas */}
      <WeatherBackground
        weatherCode={weather?.current?.weather_code ?? 0}
        isDay={weather?.current?.is_day ?? 1}
      />

      {/* Interactive Weather Particle Canvas FX */}
      <WeatherParticleCanvas
        weatherCode={weather?.current?.weather_code ?? 0}
        isDay={weather?.current?.is_day ?? 1}
        enabled={particlesEnabled}
      />

      {/* Top Navbar */}
      <Navbar
        currentLocationName={activeLocation.name}
        onSelectLocation={handleSelectLocation}
        tempUnit={tempUnit}
        onToggleTempUnit={() =>
          setTempUnit((prev) => (prev === 'celsius' ? 'fahrenheit' : 'celsius'))
        }
        onOpenSavedLocations={() => setIsSavedDrawerOpen(true)}
        onRefresh={refresh}
        isRefreshing={refreshing}
        savedCount={savedLocations.length}
      />

      {/* Main Content Container */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-4 sm:space-y-6">
        {/* Error Notification */}
        {error && <ErrorBanner message={error} onRetry={refresh} />}

        {/* Profile / Persona Selector */}
        <ProfileSelector
          selectedProfile={selectedProfile}
          onSelectProfile={setSelectedProfile}
        />

        {/* Smart Weather Alerts Banner (conditional) */}
        {alerts?.alerts && alerts.alerts.length > 0 && (
          <SmartAlerts alerts={alerts.alerts} />
        )}

        {loading || !weather || !airQuality || !recommendation ? (
          <SkeletonLoader />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-start">
            {/* Left Main Column (8 Cols on Desktop) */}
            <div className="lg:col-span-8 space-y-4 sm:space-y-6">
              {/* Hero Weather Card */}
              <HeroWeatherCard
                weather={weather}
                tempUnit={tempUnit}
                isSaved={isCurrentSaved}
                onToggleSave={handleToggleSaveCurrent}
              />

              {/* Bento Grid: Essential Weather Telemetry */}
              <WeatherStatsGrid
                current={weather.current}
                uvIndex={airQuality.uv_index}
              />

              {/* ☀️ Astronomical Solar Orbit Arc & Moon Phase Visualizer */}
              <CelestialOrbitArc
                sunrise={todayForecast?.sunrise || '06:00 AM'}
                sunset={todayForecast?.sunset || '06:30 PM'}
              />

              {/* 🛰️ Interactive Live Weather Radar & Atmospheric Map */}
              <WeatherRadarMap
                latitude={weather.latitude}
                longitude={weather.longitude}
                locationName={weather.location}
                temperature={weather.current.temperature}
              />

              {/* 24-Hour Hourly Forecast Strip */}
              <HourlyForecast
                hourly={weather.hourly}
                tempUnit={tempUnit}
              />

              {/* Recharts Interactive Telemetry Curve */}
              <WeatherChart
                hourly={weather.hourly}
                tempUnit={tempUnit}
              />
            </div>

            {/* Right Column (4 Cols on Desktop): AQI, Insights & 7-Day Outlook */}
            <div className="lg:col-span-4 space-y-4 sm:space-y-6">
              {/* Air Quality (AQI) Dial Card */}
              <AQICard airQuality={airQuality} />

              {/* Lifestyle Intel Card based on active profile */}
              <RecommendationCard recommendation={recommendation} />

              {/* 7-Day Extended Forecast with Temperature Spectrums */}
              <DailyForecast
                daily={weather.daily}
                tempUnit={tempUnit}
              />
            </div>
          </div>
        )}
      </main>

      {/* 🔊 Ambient Atmospheric Soundscape Player */}
      <SoundscapePlayer />

      {/* Saved Locations Slide-Over Drawer */}
      <SavedLocationsDrawer
        isOpen={isSavedDrawerOpen}
        onClose={() => setIsSavedDrawerOpen(false)}
        savedLocations={savedLocations}
        onSelectLocation={handleSelectLocation}
        onRemoveLocation={removeLocation}
        onAddLocation={addLocation}
        currentLocationName={activeLocation.name}
      />

      {/* Minimalist Footer */}
      <footer className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8 text-center text-[11px] sm:text-xs text-slate-500 border-t border-white/5 mt-8 sm:mt-12 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 pb-safe">
        <p>
          WeatherWise Environmental Intelligence Platform • Live Telemetry Synced with Open-Meteo & FastAPI
        </p>
        <button
          onClick={() => setParticlesEnabled(!particlesEnabled)}
          className="text-[11px] sm:text-xs text-slate-400 hover:text-cyan-300 transition-colors cursor-pointer"
        >
          {particlesEnabled ? '✨ Particle FX: Active' : '✨ Particle FX: Paused'}
        </button>
      </footer>
    </div>
  );
}

export default App;
