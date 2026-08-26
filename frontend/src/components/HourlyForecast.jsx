/**
 * HourlyForecast.jsx — Enterprise 24-Hour Telemetry Carousel.
 *
 * Visual Features:
 * - Horizontally scrollable inside container without page-level overflow
 * - Lucide React icons for meteorological accuracy
 * - Clear active highlight for current hour ("Now")
 */

import { Clock, Droplets, Sun, CloudSun, Cloud, CloudFog, CloudDrizzle, CloudRain, CloudSnow, CloudLightning } from 'lucide-react';
import { formatHour } from '../utils/weatherUtils';

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

export default function HourlyForecast({ weather }) {
  if (!weather?.hourly?.length) return null;

  const hourly = weather.hourly.slice(0, 24);

  return (
    <section aria-label="24-Hour Telemetry Forecast" className="fade-in w-full">
      <div className="panel-card p-5 sm:p-6 bg-white border border-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between mb-3.5">
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-teal-700" />
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              24-Hour Telemetry Forecast
            </h3>
          </div>
          <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">
            Scroll horizontally to view 24h timeline →
          </span>
        </div>

        {/* Carousel */}
        <div
          className="flex gap-2 sm:gap-2.5 overflow-x-auto pb-1.5 scrollbar-thin scroll-smooth w-full"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {hourly.map((hour, i) => {
            const WeatherIcon = getWeatherIconComponent(hour.weather_code);
            const timeLabel = i === 0 ? 'Now' : formatHour(hour.time);

            return (
              <div
                key={hour.time}
                className={`flex-shrink-0 text-center py-3 px-3 rounded-xl min-w-[64px] sm:min-w-[70px] transition-all select-none border ${
                  i === 0
                    ? 'bg-teal-50/80 border-teal-600/60 shadow-2xs'
                    : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                }`}
              >
                {/* Time */}
                <p className={`text-[11px] font-bold mb-2 ${i === 0 ? 'text-teal-800' : 'text-slate-500'}`}>
                  {timeLabel}
                </p>

                {/* Weather Icon */}
                <div className={`flex justify-center mb-2 ${i === 0 ? 'text-teal-700' : 'text-slate-600'}`}>
                  <WeatherIcon size={20} />
                </div>

                {/* Temperature */}
                <p className="text-sm font-bold text-slate-900 mb-1">
                  {Math.round(hour.temperature)}°
                </p>

                {/* Rain probability */}
                {hour.rain_probability > 0 ? (
                  <div className="flex items-center justify-center gap-0.5 text-[10px] text-sky-700 font-semibold">
                    <Droplets size={10} className="text-sky-600" />
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
