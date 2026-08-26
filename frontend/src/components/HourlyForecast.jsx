/**
 * HourlyForecast.jsx — Horizontally scrollable hourly forecast cards.
 *
 * Shows the next 24 hours with temperature, weather emoji, and rain %.
 */

import { Droplets } from 'lucide-react';
import { getWeatherEmoji, formatHour, getTempColor } from '../utils/weatherUtils';

export default function HourlyForecast({ weather }) {
  if (!weather?.hourly?.length) return null;

  const hourly = weather.hourly.slice(0, 24);

  return (
    <div className="glass-card-static fade-in p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-indigo-500/20">
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <h3 className="text-xs sm:text-sm text-slate-400 font-bold uppercase tracking-wider">
          Hourly Forecast (24h)
        </h3>
        <span className="text-[11px] text-slate-500 font-medium">Swipe horizontally →</span>
      </div>

      <div
        className="flex gap-2 sm:gap-2.5 overflow-x-auto pb-2 pt-0.5 scrollbar-thin scroll-smooth -mx-2 px-2 sm:mx-0 sm:px-0"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        {hourly.map((hour, i) => {
          const emoji = getWeatherEmoji(hour.weather_code);
          const timeLabel = i === 0 ? 'Now' : formatHour(hour.time);
          const tempColor = getTempColor(hour.temperature);

          return (
            <div
              key={hour.time}
              className={`flex-shrink-0 text-center py-2.5 px-3 rounded-xl min-w-[58px] sm:min-w-[64px] transition-all select-none ${
                i === 0
                  ? 'bg-indigo-500/20 border border-indigo-500/40 shadow-md shadow-indigo-500/10'
                  : 'bg-slate-900/60 border border-indigo-500/10 hover:border-indigo-500/30'
              }`}
            >
              {/* Time */}
              <p className={`text-[11px] font-bold mb-1.5 ${i === 0 ? 'text-cyan-300' : 'text-slate-400'}`}>
                {timeLabel}
              </p>

              {/* Weather emoji */}
              <div className="text-xl sm:text-2xl mb-1.5" role="img" aria-label={getWeatherEmoji(hour.weather_code)}>
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
  );
}

