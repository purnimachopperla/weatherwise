/**
 * HourlyForecast.jsx — Enterprise 24-Hour Telemetry Carousel.
 *
 * Visual Features:
 * - Horizontally scrollable inside container without page-level overflow
 * - Generous card width and padding to prevent visual merging
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
      <div className="panel-card p-6 sm:p-8 lg:p-9 bg-white border border-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <Clock size={18} className="text-teal-700" />
            <h3 className="text-xs sm:text-sm font-bold text-slate-800 uppercase tracking-wider">
              24-Hour Telemetry Forecast Timeline
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-medium hidden sm:inline">
            Scroll horizontally to inspect hourly telemetry →
          </span>
        </div>

        {/* Carousel */}
        <div
          className="flex gap-3 sm:gap-3.5 overflow-x-auto pb-2 pt-1 scrollbar-thin scroll-smooth w-full"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {hourly.map((hour, i) => {
            const WeatherIcon = getWeatherIconComponent(hour.weather_code);
            const timeLabel = i === 0 ? 'Now' : formatHour(hour.time);

            return (
              <div
                key={hour.time}
                className={`flex-shrink-0 text-center py-4 px-3.5 rounded-2xl min-w-[80px] sm:min-w-[88px] transition-all select-none border shadow-2xs ${
                  i === 0
                    ? 'bg-teal-50/90 border-teal-600/60'
                    : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                }`}
              >
                {/* Time */}
                <p className={`text-xs font-bold mb-2.5 ${i === 0 ? 'text-teal-800' : 'text-slate-500'}`}>
                  {timeLabel}
                </p>

                {/* Weather Icon */}
                <div className={`flex justify-center mb-2.5 ${i === 0 ? 'text-teal-700' : 'text-slate-600'}`}>
                  <WeatherIcon size={22} />
                </div>

                {/* Temperature */}
                <p className="text-base font-extrabold text-slate-900 mb-1.5 leading-none">
                  {Math.round(hour.temperature)}°
                </p>

                {/* Rain probability */}
                {hour.rain_probability > 0 ? (
                  <div className="flex items-center justify-center gap-1 text-[11px] text-sky-700 font-bold">
                    <Droplets size={11} className="text-sky-600 flex-shrink-0" />
                    <span>{hour.rain_probability}%</span>
                  </div>
                ) : (
                  <div className="h-[17px]" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
