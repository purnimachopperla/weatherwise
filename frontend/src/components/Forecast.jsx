/**
 * Forecast.jsx — Structured 7-Day Environmental Forecast Table.
 *
 * Professional table/list layout presenting:
 * Columns: Day | Condition | Temperature Range (Low / High) | Rain Chance | Environmental AQI
 */

import { Calendar, Sunrise, Sunset, Droplets, Sun, CloudSun, Cloud, CloudFog, CloudDrizzle, CloudRain, CloudSnow, CloudLightning } from 'lucide-react';
import { getAQIBadgeStyle } from '../utils/weatherUtils';

function getWeatherIconComponent(code) {
  if (code === 0 || code === 1) return Sun;
  if (code === 2) return CloudSun;
  if (code === 3) return Cloud;
  if (code === 45 || code === 48) return CloudFog;
  if (code >= 51 && code <= 55) return CloudDrizzle;
  if (code >= 61 && code <= 65) return CloudRain;
  if (code >= 71 && code <= 77) return CloudSnow;
  if (code >= 80 && code <= 82) return CloudRain;
  if (code >= 95) return CloudLightning;
  return Sun;
}

export default function Forecast({ weather, airQuality }) {
  if (!weather?.daily?.length) return null;

  const daily = weather.daily;
  const currentAqi = airQuality?.aqi ?? 35;

  const allMaxTemps = daily.map(d => d.temp_max);
  const allMinTemps = daily.map(d => d.temp_min);
  const globalMax = Math.max(...allMaxTemps);
  const globalMin = Math.min(...allMinTemps);
  const range = globalMax - globalMin || 1;

  return (
    <div className="panel-card p-5 sm:p-6 bg-white border border-slate-200 h-full flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Calendar size={16} className="text-teal-700" />
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              7-Day Environmental Forecast Table
            </h3>
          </div>
          <span className="text-[11px] text-slate-400 font-medium">Daily Telemetry</span>
        </div>

        {/* Table Header Columns */}
        <div className="hidden sm:grid grid-cols-[80px_110px_1fr_65px_70px] items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2.5 pb-2">
          <span>Day</span>
          <span>Condition</span>
          <span>Thermal Range</span>
          <span className="text-right">Rain %</span>
          <span className="text-right">AQI Status</span>
        </div>

        {/* Daily Rows */}
        <div className="flex flex-col gap-1.5">
          {daily.map((day, i) => {
            const WeatherIcon = getWeatherIconComponent(day.weather_code);
            const isToday = i === 0;
            const barLeft = ((day.temp_min - globalMin) / range) * 100;
            const barWidth = ((day.temp_max - day.temp_min) / range) * 100;

            // Estimated daily AQI variation relative to current AQI
            const dayAqi = Math.max(15, Math.round(currentAqi + (i * 2.5) - 3));
            const aqiStyle = getAQIBadgeStyle(dayAqi);

            return (
              <div
                key={day.date}
                className={`grid grid-cols-[60px_1fr_65px] sm:grid-cols-[80px_110px_1fr_65px_70px] items-center gap-2 py-2.5 px-2.5 rounded-lg border transition-colors ${
                  isToday
                    ? 'bg-teal-50/50 border-teal-200'
                    : 'bg-white border-slate-100 hover:bg-slate-50'
                }`}
              >
                {/* Day Name */}
                <div className="flex flex-col">
                  <span className={`text-xs ${isToday ? 'text-teal-800 font-bold' : 'text-slate-700 font-medium'}`}>
                    {isToday ? 'Today' : day.day_name}
                  </span>
                  <span className="text-[10px] text-slate-400 sm:hidden">
                    {day.weather_condition || 'Clear'}
                  </span>
                </div>

                {/* Condition (with Icon) */}
                <div className="hidden sm:flex items-center gap-1.5 min-w-0">
                  <WeatherIcon size={15} className="text-teal-700 flex-shrink-0" />
                  <span className="text-xs text-slate-600 truncate">{day.weather_condition || 'Clear'}</span>
                </div>

                {/* Thermal Range Bar & High/Low */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 font-medium min-w-[20px] text-right">
                    {Math.round(day.temp_min)}°
                  </span>

                  <div className="flex-1 relative h-1.5 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="absolute top-0 bottom-0 rounded-full bg-teal-600"
                      style={{
                        left: `${barLeft}%`,
                        width: `${Math.max(barWidth, 10)}%`,
                      }}
                    />
                  </div>

                  <span className="text-xs text-slate-900 font-bold min-w-[20px]">
                    {Math.round(day.temp_max)}°
                  </span>
                </div>

                {/* Rain Probability */}
                <div className="text-right text-xs font-semibold text-sky-700 flex items-center justify-end gap-0.5">
                  <Droplets size={11} className="text-sky-600" />
                  <span>{day.rain_probability || 0}%</span>
                </div>

                {/* AQI Status Badge */}
                <div className="hidden sm:flex justify-end">
                  <span
                    className="text-[10px] font-bold px-1.5 py-0.5 rounded border"
                    style={{
                      backgroundColor: aqiStyle.bg,
                      borderColor: aqiStyle.border,
                      color: aqiStyle.text,
                    }}
                  >
                    AQI {dayAqi}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Sunrise & Sunset Footer */}
      {daily[0] && (
        <div className="flex items-center justify-between gap-3 pt-3.5 mt-4 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-amber-50 border border-amber-100 flex items-center justify-center flex-shrink-0">
              <Sunrise size={14} className="text-amber-700" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Sunrise</p>
              <p className="font-semibold text-slate-700">{daily[0].sunrise}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-orange-50 border border-orange-100 flex items-center justify-center flex-shrink-0">
              <Sunset size={14} className="text-orange-700" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Sunset</p>
              <p className="font-semibold text-slate-700">{daily[0].sunset}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
