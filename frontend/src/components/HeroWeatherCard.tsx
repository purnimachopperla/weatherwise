import React from 'react';
import { motion } from 'framer-motion';
import {
  MapPin,
  Bookmark,
  BookmarkCheck,
  ArrowUp,
  ArrowDown,
  Clock,
  Sparkles,
} from 'lucide-react';
import type { WeatherResponse, TemperatureUnit } from '../types/weather';
import { formatTemperature } from '../utils/formatters';
import { getWeatherIconComponent, getWeatherConditionName } from '../utils/weatherIcons';

interface HeroWeatherCardProps {
  weather: WeatherResponse;
  tempUnit: TemperatureUnit;
  isSaved: boolean;
  onToggleSave: () => void;
}

export const HeroWeatherCard: React.FC<HeroWeatherCardProps> = ({
  weather,
  tempUnit,
  isSaved,
  onToggleSave,
}) => {
  const current = weather.current;
  const todayForecast = weather.daily?.[0];
  const conditionText =
    current.weather_condition ||
    current.condition ||
    getWeatherConditionName(current.weather_code);

  const formattedTime = new Date().toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="relative overflow-hidden rounded-2xl glass-card border border-white/10 p-6 sm:p-7 transition-all duration-300"
    >
      {/* Background Soft Glow */}
      <div className="absolute -top-16 -right-16 w-52 h-52 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Card Header Row */}
      <div className="flex items-start justify-between gap-3 relative z-10 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-cyan-400 flex-shrink-0" />
            <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-white">
              {weather.location}
            </h1>
            {weather.country && (
              <span className="px-2 py-0.5 rounded-md bg-white/10 text-slate-300 text-xs font-semibold">
                {weather.country}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-400">
            <span className="flex items-center gap-1 font-mono">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              {formattedTime} local
            </span>
            <span className="w-1 h-1 rounded-full bg-slate-600" />
            <span className="font-mono">
              {weather.latitude.toFixed(2)}°, {weather.longitude.toFixed(2)}°
            </span>
          </div>
        </div>

        {/* Bookmark Action */}
        <button
          onClick={onToggleSave}
          className={`p-2.5 rounded-xl border transition-all duration-200 cursor-pointer ${
            isSaved
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-glow-amber'
              : 'bg-dark-900/60 text-slate-400 hover:text-amber-300 hover:bg-dark-900 border-white/10'
          }`}
          title={isSaved ? 'Remove from saved locations' : 'Save location'}
        >
          {isSaved ? (
            <BookmarkCheck className="w-5 h-5 text-amber-400" />
          ) : (
            <Bookmark className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Main Temperature & Visuals Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 items-center gap-6 relative z-10">
        {/* Big Temperature Readout */}
        <div className="flex items-baseline gap-4">
          <div className="font-display text-6xl sm:text-7xl font-extrabold tracking-tighter text-white">
            {formatTemperature(current.temperature, tempUnit, 0)}
          </div>
          <div className="space-y-1">
            <div className="text-sm font-semibold text-slate-200 flex items-center gap-1">
              <span>Feels like</span>
              <span className="text-cyan-300 font-mono">
                {formatTemperature(current.feels_like, tempUnit, 0)}
              </span>
            </div>
            {todayForecast && (
              <div className="flex items-center gap-2.5 text-xs font-mono">
                <span className="flex items-center text-rose-400 font-medium">
                  <ArrowUp className="w-3 h-3 mr-0.5" />
                  {formatTemperature(todayForecast.temp_max, tempUnit, 0)}
                </span>
                <span className="flex items-center text-cyan-400 font-medium">
                  <ArrowDown className="w-3 h-3 mr-0.5" />
                  {formatTemperature(todayForecast.temp_min, tempUnit, 0)}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Weather Condition Badge & Icon */}
        <div className="flex sm:flex-col sm:items-end justify-between items-center gap-3">
          <div className="flex items-center gap-3">
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 shadow-inner">
              {getWeatherIconComponent(current.weather_code, current.is_day, 'w-10 h-10')}
            </div>
            <div className="sm:text-right">
              <div className="text-lg font-semibold text-slate-100">{conditionText}</div>
              <div className="text-xs text-slate-400">
                {current.is_day ? 'Daytime telemetry' : 'Nighttime conditions'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Card Footer Highlights */}
      <div className="mt-6 pt-4 border-t border-white/5 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
        <div className="flex items-center gap-1.5 text-cyan-400/90 font-medium">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Real-time Multi-Tier telemetry synced</span>
        </div>
        {todayForecast && (
          <div className="flex items-center gap-3">
            <span>🌅 Sunrise: <strong className="text-slate-200">{todayForecast.sunrise}</strong></span>
            <span>🌇 Sunset: <strong className="text-slate-200">{todayForecast.sunset}</strong></span>
          </div>
        )}
      </div>
    </motion.div>
  );
};
