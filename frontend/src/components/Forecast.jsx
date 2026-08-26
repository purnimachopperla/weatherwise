/**
 * Forecast.jsx — Responsive 7-day daily forecast component.
 *
 * Shows: day name, weather emoji, temp range bar,
 * high/low temps, rain probability, sunrise/sunset.
 */

import { Sunrise, Sunset, Droplets } from 'lucide-react';
import { getWeatherEmoji, getTempColor } from '../utils/weatherUtils';

export default function Forecast({ weather }) {
  if (!weather?.daily?.length) return null;

  const daily = weather.daily;

  // Find the overall temp range to draw proportional bars
  const allMaxTemps = daily.map(d => d.temp_max);
  const allMinTemps = daily.map(d => d.temp_min);
  const globalMax = Math.max(...allMaxTemps);
  const globalMin = Math.min(...allMinTemps);
  const range = globalMax - globalMin || 1;

  return (
    <div className="glass-card-static fade-in p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-indigo-500/20">
      <h3 className="text-xs sm:text-sm text-slate-400 font-bold uppercase tracking-wider mb-3 sm:mb-4">
        7-Day Forecast
      </h3>

      <div className="flex flex-col gap-1 sm:gap-1.5">
        {daily.map((day, i) => {
          const emoji = getWeatherEmoji(day.weather_code);
          const isToday = i === 0;

          // Temperature bar positioning
          const barLeft = ((day.temp_min - globalMin) / range) * 100;
          const barWidth = ((day.temp_max - day.temp_min) / range) * 100;
          const minColor = getTempColor(day.temp_min);
          const maxColor = getTempColor(day.temp_max);

          return (
            <div
              key={day.date}
              className={`grid grid-cols-[54px_24px_1fr_56px] xs:grid-cols-[68px_28px_1fr_64px] sm:grid-cols-[80px_32px_1fr_76px] items-center gap-1.5 xs:gap-2 sm:gap-3 py-2 px-2 sm:px-3 rounded-xl transition-colors ${
                isToday ? 'bg-indigo-500/10 border border-indigo-500/20' : 'hover:bg-slate-900/40'
              }`}
            >
              {/* Day name */}
              <span className={`text-xs sm:text-sm truncate ${isToday ? 'text-slate-100 font-bold' : 'text-slate-300 font-medium'}`}>
                {day.day_name}
              </span>

              {/* Weather emoji */}
              <span className="text-base sm:text-xl text-center select-none" role="img">
                {emoji}
              </span>

              {/* Temperature bar */}
              <div className="relative h-2 rounded-full bg-slate-900/80 overflow-hidden border border-indigo-500/10">
                <div
                  className="absolute top-0 bottom-0 rounded-full"
                  style={{
                    left: `${barLeft}%`,
                    width: `${Math.max(barWidth, 8)}%`,
                    background: `linear-gradient(to right, ${minColor}, ${maxColor})`,
                  }}
                />
              </div>

              {/* Temp range */}
              <div className="flex items-center justify-end gap-1 sm:gap-2 text-xs sm:text-sm font-semibold">
                <span className="text-slate-400 font-medium min-w-[20px] sm:min-w-[24px] text-right">
                  {Math.round(day.temp_min)}°
                </span>
                <span className="text-slate-100 font-bold min-w-[20px] sm:min-w-[24px] text-right">
                  {Math.round(day.temp_max)}°
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Sunrise / Sunset for today */}
      {daily[0] && (
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-3 sm:gap-6 mt-4 pt-3.5 border-t border-indigo-500/15">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 flex items-center justify-center flex-shrink-0">
              <Sunrise size={15} className="text-amber-400" />
            </div>
            <div>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Sunrise</p>
              <p className="text-xs sm:text-sm font-semibold text-slate-200">{daily[0].sunrise}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-orange-500/10 flex items-center justify-center flex-shrink-0">
              <Sunset size={15} className="text-orange-400" />
            </div>
            <div>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Sunset</p>
              <p className="text-xs sm:text-sm font-semibold text-slate-200">{daily[0].sunset}</p>
            </div>
          </div>

          {daily[0].rain_probability > 0 && (
            <div className="flex items-center gap-2 col-span-2 sm:col-span-1">
              <div className="w-7 h-7 rounded-lg bg-cyan-500/10 flex items-center justify-center flex-shrink-0">
                <Droplets size={15} className="text-cyan-400" />
              </div>
              <div>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Rain Max</p>
                <p className="text-xs sm:text-sm font-semibold text-cyan-300">{daily[0].rain_probability}%</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

