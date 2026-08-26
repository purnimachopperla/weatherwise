/**
 * HourlyForecast.jsx — Smooth 24-hour horizontal forecast carousel.
 *
 * Visual features:
 * - Horizontally scrollable without page-level overflow
 * - Clear active highlight for current hour ("Now")
 * - Rain probability indicators and color-coded temperatures
 */

import { Droplets, Clock } from 'lucide-react';
import { getWeatherEmoji, formatHour, getTempColor } from '../utils/weatherUtils';

export default function HourlyForecast({ weather }) {
  if (!weather?.hourly?.length) return null;

  const hourly = weather.hourly.slice(0, 24);

  return (
    <section aria-label="Hourly Forecast" className="fade-in w-full">
      <div className="glass-panel p-5 sm:p-6 rounded-3xl border border-white/5 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-cyan-400" />
            <h3 className="text-xs sm:text-sm font-bold text-slate-300 uppercase tracking-wider">
              24-Hour Forecast
            </h3>
          </div>
          <span className="text-[11px] text-slate-500 font-medium hidden sm:inline">
            Scroll horizontally →
          </span>
        </div>

        {/* Horizontal Carousel */}
        <div
          className="flex gap-2 sm:gap-2.5 overflow-x-auto pb-1 scrollbar-thin scroll-smooth w-full"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {hourly.map((hour, i) => {
            const emoji = getWeatherEmoji(hour.weather_code);
            const timeLabel = i === 0 ? 'Now' : formatHour(hour.time);
            const tempColor = getTempColor(hour.temperature);

            return (
              <div
                key={hour.time}
                className={`flex-shrink-0 text-center py-3 px-3 rounded-2xl min-w-[62px] sm:min-w-[68px] transition-all select-none ${
                  i === 0
                    ? 'bg-indigo-500/25 border border-indigo-500/40 shadow-lg shadow-indigo-500/10'
                    : 'bg-slate-900/60 border border-white/5 hover:border-indigo-500/25'
                }`}
              >
                {/* Time */}
                <p className={`text-[11px] font-bold mb-1.5 ${i === 0 ? 'text-cyan-300' : 'text-slate-400'}`}>
                  {timeLabel}
                </p>

                {/* Weather emoji */}
                <div className="text-2xl sm:text-3xl mb-1.5" role="img" aria-label="Weather condition">
                  {emoji}
                </div>

                {/* Temperature */}
                <p className="text-sm sm:text-base font-black mb-1" style={{ color: tempColor }}>
                  {Math.round(hour.temperature)}°
                </p>

                {/* Rain probability */}
                {hour.rain_probability > 0 ? (
                  <div className="flex items-center justify-center gap-0.5 text-[10px] text-cyan-300 font-semibold">
                    <Droplets size={10} className="text-cyan-400" />
                    <span>{hour.rain_probability}%</span>
                  </div>
                ) : (
                  <div className="h-[15px]" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
