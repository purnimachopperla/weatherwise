/**
 * CurrentWeather.jsx — Responsive Hero weather display card.
 *
 * Shows: city name, large temperature, condition,
 * feels-like, daily high/low, and responsive weather emoji.
 */

import { MapPin, ArrowUp, ArrowDown } from 'lucide-react';
import { getWeatherEmoji, getTempColor } from '../utils/weatherUtils';

export default function CurrentWeather({ weather, location }) {
  if (!weather) return null;

  const { current, daily } = weather;
  const today = daily?.[0];
  const emoji = getWeatherEmoji(current.weather_code);
  const tempColor = getTempColor(current.temperature);

  // Background gradient changes based on day/night
  const bgGradient = current.is_day
    ? 'linear-gradient(135deg, rgba(99,102,241,0.18) 0%, rgba(6,182,212,0.12) 100%)'
    : 'linear-gradient(135deg, rgba(30,20,80,0.5) 0%, rgba(10,15,40,0.4) 100%)';

  return (
    <div
      className="glass-card-static fade-in p-5 sm:p-7 lg:p-8 relative overflow-hidden rounded-2xl sm:rounded-3xl border border-indigo-500/20"
      style={{ background: bgGradient }}
    >
      {/* Background decorative ambient glow */}
      <div
        className="absolute -top-12 -right-12 w-48 sm:w-64 h-48 sm:h-64 rounded-full pointer-events-none blur-3xl opacity-30"
        style={{ background: 'radial-gradient(circle, #6366f1, transparent)' }}
      />

      <div className="flex items-center justify-between gap-4 relative z-10">
        {/* Left: Text & Numbers */}
        <div className="min-w-0 flex-1">
          {/* Location Title */}
          <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
            <MapPin size={16} className="text-cyan-400 flex-shrink-0" />
            <span className="text-sm sm:text-base font-bold text-slate-200 truncate">
              {location?.name || weather.location}
              {location?.country && (
                <span className="text-slate-400 font-normal ml-1">
                  , {location.country}
                </span>
              )}
            </span>
          </div>

          {/* Temperature */}
          <div className="flex items-baseline gap-1 sm:gap-2 mb-1.5 sm:mb-2">
            <span
              className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight leading-none"
              style={{
                color: tempColor,
                textShadow: `0 0 35px ${tempColor}40`,
              }}
            >
              {Math.round(current.temperature)}°
            </span>
            <span className="text-xl sm:text-2xl font-bold text-slate-400">C</span>
          </div>

          {/* Weather Condition */}
          <p className="text-lg sm:text-xl md:text-2xl font-bold text-slate-100 mb-1">
            {current.weather_condition}
          </p>

          {/* Feels like */}
          <p className="text-xs sm:text-sm text-slate-400 mb-3 sm:mb-4">
            Feels like <span className="text-slate-200 font-semibold">{Math.round(current.feels_like)}°C</span>
          </p>

          {/* High / Low Badges */}
          {today && (
            <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
              <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-500/10 border border-red-500/20 text-xs font-bold text-red-300">
                <ArrowUp size={13} className="text-red-400" />
                <span>H: {Math.round(today.temp_max)}°C</span>
              </div>
              <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-xs font-bold text-cyan-300">
                <ArrowDown size={13} className="text-cyan-400" />
                <span>L: {Math.round(today.temp_min)}°C</span>
              </div>
            </div>
          )}
        </div>

        {/* Right: Weather Emoji */}
        <div
          className="weather-icon-pulse text-5xl sm:text-6xl md:text-7xl lg:text-8xl flex-shrink-0 select-none drop-shadow-xl"
          role="img"
          aria-label={current.weather_condition}
        >
          {emoji}
        </div>
      </div>
    </div>
  );
}

