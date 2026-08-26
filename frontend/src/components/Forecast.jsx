/**
 * Forecast.jsx — Clean, modern 7-day daily forecast component.
 *
 * Visual Features:
 * - High/Low temperature proportional gradient bars
 * - Crisp daily list layout with weather icons
 * - Sunrise, sunset, and maximum daily rain probability footer
 */

import { Calendar, Sunrise, Sunset, Droplets } from 'lucide-react';
import { getWeatherEmoji, getTempColor } from '../utils/weatherUtils';

export default function Forecast({ weather }) {
  if (!weather?.daily?.length) return null;

  const daily = weather.daily;

  // Find overall temp range to draw proportional temperature bars
  const allMaxTemps = daily.map(d => d.temp_max);
  const allMinTemps = daily.map(d => d.temp_min);
  const globalMax = Math.max(...allMaxTemps);
  const globalMin = Math.min(...allMinTemps);
  const range = globalMax - globalMin || 1;

  return (
    <div className="glass-panel p-5 sm:p-6 rounded-3xl border border-white/5 h-full flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center gap-2 mb-4">
          <Calendar size={16} className="text-cyan-400" />
          <h3 className="text-xs sm:text-sm font-bold text-slate-300 uppercase tracking-wider">
            7-Day Forecast
          </h3>
        </div>

        {/* Daily Rows */}
        <div className="flex flex-col gap-1.5">
          {daily.map((day, i) => {
            const emoji = getWeatherEmoji(day.weather_code);
            const isToday = i === 0;

            const barLeft = ((day.temp_min - globalMin) / range) * 100;
            const barWidth = ((day.temp_max - day.temp_min) / range) * 100;
            const minColor = getTempColor(day.temp_min);
            const maxColor = getTempColor(day.temp_max);

            return (
              <div
                key={day.date}
                className={`grid grid-cols-[60px_26px_1fr_60px] sm:grid-cols-[80px_30px_1fr_70px] items-center gap-2 py-2 px-2.5 rounded-xl transition-colors ${
                  isToday ? 'bg-indigo-500/10 border border-indigo-500/20' : 'hover:bg-white/5'
                }`}
              >
                {/* Day name */}
                <span className={`text-xs sm:text-sm truncate ${isToday ? 'text-cyan-300 font-bold' : 'text-slate-300 font-medium'}`}>
                  {isToday ? 'Today' : day.day_name}
                </span>

                {/* Weather emoji */}
                <span className="text-base sm:text-lg text-center select-none" role="img" aria-label="forecast icon">
                  {emoji}
                </span>

                {/* Proportional Temperature Bar */}
                <div className="relative h-1.5 sm:h-2 rounded-full bg-slate-950/80 overflow-hidden border border-white/5">
                  <div
                    className="absolute top-0 bottom-0 rounded-full"
                    style={{
                      left: `${barLeft}%`,
                      width: `${Math.max(barWidth, 8)}%`,
                      background: `linear-gradient(to right, ${minColor}, ${maxColor})`,
                    }}
                  />
                </div>

                {/* Min / Max Numbers */}
                <div className="flex items-center justify-end gap-1.5 text-xs sm:text-sm font-semibold">
                  <span className="text-slate-400 font-normal min-w-[20px] text-right">
                    {Math.round(day.temp_min)}°
                  </span>
                  <span className="text-slate-100 font-bold min-w-[20px] text-right">
                    {Math.round(day.temp_max)}°
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Sunrise, Sunset, and Rain Max Footer */}
      {daily[0] && (
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center justify-between gap-3 pt-4 mt-4 border-t border-white/5 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 flex items-center justify-center flex-shrink-0">
              <Sunrise size={14} className="text-amber-400" />
            </div>
            <div>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Sunrise</p>
              <p className="font-semibold text-slate-200">{daily[0].sunrise}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-orange-500/10 flex items-center justify-center flex-shrink-0">
              <Sunset size={14} className="text-orange-400" />
            </div>
            <div>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Sunset</p>
              <p className="font-semibold text-slate-200">{daily[0].sunset}</p>
            </div>
          </div>

          {daily[0].rain_probability > 0 && (
            <div className="flex items-center gap-2 col-span-2 sm:col-span-1">
              <div className="w-7 h-7 rounded-lg bg-cyan-500/10 flex items-center justify-center flex-shrink-0">
                <Droplets size={14} className="text-cyan-400" />
              </div>
              <div>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Rain Peak</p>
                <p className="font-semibold text-cyan-300">{daily[0].rain_probability}%</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
