/**
 * CurrentWeather.jsx — Modern Hero Weather Component.
 *
 * Visual focal point of WeatherWise:
 * - Ultra-clean typography and visual hierarchy
 * - Big temperature, condition text, high/low pills, and animated weather emoji
 * - Responsive layout: 320px mobile to 1440px+ desktop
 */

import { MapPin, ArrowUp, ArrowDown, Sparkles } from 'lucide-react';
import { getWeatherEmoji, getTempColor } from '../utils/weatherUtils';

export default function CurrentWeather({ weather, location }) {
  if (!weather?.current) return null;

  const { current, daily } = weather;
  const today = daily?.[0];
  const emoji = getWeatherEmoji(current.weather_code);
  const tempColor = getTempColor(current.temperature);

  return (
    <section aria-label="Current Weather" className="fade-in w-full">
      <div
        className="relative overflow-hidden rounded-3xl p-6 sm:p-8 md:p-10 border border-white/10 shadow-2xl transition-all"
        style={{
          background: 'linear-gradient(135deg, rgba(30, 41, 77, 0.7) 0%, rgba(13, 20, 36, 0.85) 100%)',
          backdropFilter: 'blur(30px)',
          WebkitBackdropFilter: 'blur(30px)',
        }}
      >
        {/* Soft atmospheric gradient accent */}
        <div
          className="absolute -top-24 -right-24 w-72 h-72 rounded-full opacity-20 pointer-events-none filter blur-3xl"
          style={{ background: tempColor }}
        />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6 sm:gap-8">
          {/* Left: Location, Condition, and Primary Temperature */}
          <div className="flex-1 min-w-0">
            {/* Location Pill */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-4 sm:mb-6">
              <MapPin size={14} className="text-cyan-400 flex-shrink-0" />
              <span className="text-xs sm:text-sm font-semibold text-slate-200 break-words">
                {location?.name || weather.location}
                {location?.country && <span className="text-slate-400 font-normal">, {location.country}</span>}
              </span>
            </div>

            {/* Main Temperature & Degree */}
            <div className="flex items-baseline gap-2 sm:gap-3 mb-2 sm:mb-3">
              <span
                className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tighter leading-none"
                style={{
                  color: tempColor,
                  textShadow: `0 0 40px ${tempColor}35`,
                }}
              >
                {Math.round(current.temperature)}°
              </span>
              <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-400">C</span>
            </div>

            {/* Weather Condition */}
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-100 tracking-tight mb-2 break-words">
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

          {/* Right: Weather Emoji & Atmospheric Mood Illustration */}
          <div className="flex flex-col items-start md:items-end justify-center flex-shrink-0 pt-2 md:pt-0">
            <div
              className="weather-icon-pulse text-6xl sm:text-7xl md:text-8xl lg:text-9xl select-none"
              role="img"
              aria-label={current.weather_condition}
            >
              {emoji}
            </div>
            <div className="flex items-center gap-1.5 mt-3 text-[11px] font-medium text-slate-400 bg-white/5 px-2.5 py-1 rounded-full border border-white/5">
              <Sparkles size={11} className="text-cyan-400" />
              <span>Real-Time Weather</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
