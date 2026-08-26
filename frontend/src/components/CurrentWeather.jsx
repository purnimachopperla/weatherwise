/**
 * CurrentWeather.jsx — Centered, balanced Hero Weather Component.
 *
 * Visual focal point of WeatherWise:
 * - Ultra-clean typography and visual hierarchy
 * - Prominent temperature, condition, high/low pills
 * - Supporting atmospheric mini-metrics for balanced desktop composition
 * - Glowing animated weather illustration
 */

import { MapPin, ArrowUp, ArrowDown, Sparkles, Wind, Droplets, Sun, Compass } from 'lucide-react';
import { getWeatherEmoji, getTempColor, getUVLabel } from '../utils/weatherUtils';

export default function CurrentWeather({ weather, location }) {
  if (!weather?.current) return null;

  const { current, daily } = weather;
  const today = daily?.[0];
  const emoji = getWeatherEmoji(current.weather_code);
  const tempColor = getTempColor(current.temperature);

  return (
    <section aria-label="Current Weather" className="fade-in w-full">
      <div
        className="relative overflow-hidden rounded-3xl p-6 sm:p-8 md:p-10 lg:p-12 border border-white/10 shadow-2xl transition-all w-full"
        style={{
          background: 'linear-gradient(135deg, rgba(26, 36, 68, 0.75) 0%, rgba(11, 17, 32, 0.9) 100%)',
          backdropFilter: 'blur(30px)',
          WebkitBackdropFilter: 'blur(30px)',
        }}
      >
        {/* Ambient atmospheric color bleed */}
        <div
          className="absolute -top-32 -right-32 w-96 h-96 rounded-full opacity-20 pointer-events-none filter blur-3xl"
          style={{ background: tempColor }}
        />

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 items-center">
          {/* Left: Location, Condition, and Primary Temperature (md:col-span-7 lg:col-span-6) */}
          <div className="md:col-span-7 lg:col-span-6 flex flex-col items-start min-w-0">
            {/* Location Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 mb-4 sm:mb-6">
              <MapPin size={14} className="text-cyan-400 flex-shrink-0" />
              <span className="text-xs sm:text-sm font-semibold text-slate-200 break-words">
                {location?.name || weather.location}
                {location?.country && <span className="text-slate-400 font-normal">, {location.country}</span>}
              </span>
            </div>

            {/* Main Temperature & Degree */}
            <div className="flex items-baseline gap-2 sm:gap-3 mb-2">
              <span
                className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tighter leading-none"
                style={{
                  color: tempColor,
                  textShadow: `0 0 45px ${tempColor}35`,
                }}
              >
                {Math.round(current.temperature)}°
              </span>
              <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-400">C</span>
            </div>

            {/* Weather Condition */}
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-100 tracking-tight mb-3 break-words">
              {current.weather_condition}
            </h2>

            {/* Feels like + High/Low Badges Row */}
            <div className="flex items-center gap-3 sm:gap-4 flex-wrap text-xs sm:text-sm text-slate-300">
              <span className="font-medium text-slate-400">
                Feels like <strong className="text-slate-100 font-semibold">{Math.round(current.feels_like)}°C</strong>
              </span>

              {today && (
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-red-500/10 border border-red-500/20 text-red-300 font-semibold text-xs">
                    <ArrowUp size={12} className="text-red-400" />
                    {Math.round(today.temp_max)}°
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 font-semibold text-xs">
                    <ArrowDown size={12} className="text-cyan-400" />
                    {Math.round(today.temp_min)}°
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Center (Desktop): Quick Atmospheric Overview Badges (hidden on mobile, lg:col-span-3) */}
          <div className="hidden lg:flex lg:col-span-3 flex-col gap-2.5 p-4 rounded-2xl bg-slate-950/40 border border-white/5">
            <div className="flex items-center justify-between text-xs py-1 border-b border-white/5">
              <span className="text-slate-400 flex items-center gap-1.5 font-medium">
                <Droplets size={13} className="text-cyan-400" /> Humidity
              </span>
              <span className="text-slate-200 font-bold">{Math.round(current.humidity)}%</span>
            </div>

            <div className="flex items-center justify-between text-xs py-1 border-b border-white/5">
              <span className="text-slate-400 flex items-center gap-1.5 font-medium">
                <Wind size={13} className="text-indigo-400" /> Wind
              </span>
              <span className="text-slate-200 font-bold">{Math.round(current.wind_speed)} km/h</span>
            </div>

            {today?.rain_probability != null && (
              <div className="flex items-center justify-between text-xs py-1 border-b border-white/5">
                <span className="text-slate-400 flex items-center gap-1.5 font-medium">
                  <Compass size={13} className="text-teal-400" /> Rain Chance
                </span>
                <span className="text-cyan-300 font-bold">{today.rain_probability}%</span>
              </div>
            )}

            <div className="flex items-center justify-between text-xs py-1">
              <span className="text-slate-400 flex items-center gap-1.5 font-medium">
                <Sun size={13} className="text-amber-400" /> Condition
              </span>
              <span className="text-slate-200 font-bold truncate max-w-[120px]">{current.weather_condition}</span>
            </div>
          </div>

          {/* Right: Weather Emoji & Live Indicator (md:col-span-5 lg:col-span-3) */}
          <div className="md:col-span-5 lg:col-span-3 flex flex-col items-center md:items-end justify-center pt-2 md:pt-0">
            <div
              className="weather-icon-pulse text-6xl sm:text-7xl md:text-8xl lg:text-9xl select-none"
              role="img"
              aria-label={current.weather_condition}
            >
              {emoji}
            </div>
            <div className="flex items-center gap-1.5 mt-3 text-[11px] font-medium text-slate-400 bg-white/5 px-3 py-1 rounded-full border border-white/5">
              <Sparkles size={11} className="text-cyan-400" />
              <span>Real-Time Weather</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
