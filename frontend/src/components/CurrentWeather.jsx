/**
 * CurrentWeather.jsx — Enterprise Environmental Status & Hero Metric Overview.
 *
 * Polished visual design:
 * - Geometric high-contrast typography
 * - Modern subtle gradient hero background
 * - Symmetrically aligned Environmental Safety Index & Real-Time Risk Level
 */

import {
  MapPin, ArrowUp, ArrowDown, ShieldCheck,
  Sun, CloudSun, Cloud, CloudFog, CloudDrizzle, CloudRain, CloudSnow, CloudLightning,
  Activity, Sparkles
} from 'lucide-react';
import { calculateEnvironmentalSafety, getAQIBadgeStyle, getAQILabel } from '../utils/weatherUtils';

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

export default function CurrentWeather({ weather, location, airQuality }) {
  if (!weather?.current) return null;

  const { current, daily } = weather;
  const today = daily?.[0];
  const WeatherIcon = getWeatherIconComponent(current.weather_code);
  const safety = calculateEnvironmentalSafety(weather, airQuality);
  const aqiBadge = getAQIBadgeStyle(airQuality?.aqi);
  const aqiLabel = getAQILabel(airQuality?.aqi);

  return (
    <section aria-label="Environmental Status Hero" className="fade-in w-full">
      <div className="panel-card p-6 sm:p-8 lg:p-10 bg-gradient-to-br from-white via-white to-teal-50/40 border border-slate-200/90 shadow-md">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 xl:gap-12 items-stretch">
          {/* Left Column: Location, Temperature, Weather Condition (lg:col-span-7) */}
          <div className="lg:col-span-7 flex flex-col justify-between items-start min-w-0">
            {/* Station / Location Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100/90 border border-slate-200 text-xs font-semibold text-slate-800 mb-4 sm:mb-5 shadow-2xs">
              <MapPin size={14} className="text-teal-700 flex-shrink-0" />
              <span className="truncate">
                {location?.name || weather.location}
                {location?.country && <span className="text-slate-500 font-normal">, {location.country}</span>}
              </span>
              <span className="text-[10px] text-teal-800 font-bold bg-teal-100/80 px-2 py-0.5 rounded-full border border-teal-300/80 ml-1.5 flex-shrink-0 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-600 animate-pulse" />
                LIVE
              </span>
            </div>

            {/* Main Temperature & Weather Icon Group */}
            <div className="flex items-center gap-6 sm:gap-8 my-2 sm:my-3">
              <div className="flex items-baseline">
                <span className="text-7xl sm:text-8xl md:text-9xl font-black text-slate-900 tracking-tighter leading-none">
                  {Math.round(current.temperature)}°
                </span>
                <span className="text-2xl sm:text-3xl font-bold text-slate-400 ml-1.5">C</span>
              </div>

              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-tr from-teal-100/80 to-teal-50 border border-teal-200/80 flex items-center justify-center text-teal-700 flex-shrink-0 shadow-sm">
                <WeatherIcon size={38} />
              </div>
            </div>

            {/* Condition Label */}
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-800 tracking-tight mt-2 mb-3">
              {current.weather_condition}
            </h2>

            {/* Telemetry metadata: Feels like, High/Low */}
            <div className="flex items-center gap-3.5 sm:gap-5 flex-wrap text-xs sm:text-sm text-slate-600 mt-2">
              <span className="font-medium bg-slate-100/70 px-3 py-1.5 rounded-xl border border-slate-200/60">
                Feels like <strong className="text-slate-900 font-bold ml-0.5">{Math.round(current.feels_like)}°C</strong>
              </span>

              {today && (
                <div className="flex items-center gap-2.5">
                  <span className="inline-flex items-center gap-1.5 font-bold text-slate-800 text-xs sm:text-sm bg-rose-50/80 text-rose-900 px-3 py-1.5 rounded-xl border border-rose-200/60">
                    <ArrowUp size={13} className="text-rose-600" />
                    H: {Math.round(today.temp_max)}°
                  </span>
                  <span className="inline-flex items-center gap-1.5 font-bold text-slate-800 text-xs sm:text-sm bg-sky-50/80 text-sky-900 px-3 py-1.5 rounded-xl border border-sky-200/60">
                    <ArrowDown size={13} className="text-sky-600" />
                    L: {Math.round(today.temp_min)}°
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Environmental Safety Index & Risk Assessment (lg:col-span-5) */}
          <div className="lg:col-span-5 flex flex-col justify-between p-6 sm:p-7 rounded-3xl bg-white/90 backdrop-blur-xs border border-slate-200/90 shadow-sm">
            {/* Header: Title & Risk Badge */}
            <div className="flex items-center justify-between gap-3 pb-3.5 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <ShieldCheck size={20} className="text-teal-700" />
                <span className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                  Environmental Safety Index
                </span>
              </div>
              <span
                className="text-xs font-black px-3.5 py-1 rounded-full border shadow-2xs flex-shrink-0"
                style={{
                  backgroundColor: safety.level === 'LOW' ? '#f0fdf4' : safety.level === 'MODERATE' ? '#fffbeb' : '#fef2f2',
                  borderColor: safety.level === 'LOW' ? '#86efac' : safety.level === 'MODERATE' ? '#fde047' : '#fca5a5',
                  color: safety.level === 'LOW' ? '#15803d' : safety.level === 'MODERATE' ? '#b45309' : '#b91c1c',
                }}
              >
                {safety.level} RISK
              </span>
            </div>

            {/* Score & AQI Summary Row */}
            <div className="flex items-baseline justify-between gap-4 my-4">
              <div>
                <span className="text-5xl sm:text-6xl font-black text-slate-900 tracking-tight">
                  {safety.score}
                </span>
                <span className="text-lg font-bold text-slate-400"> / 100</span>
              </div>
              <div
                className="text-xs font-bold px-3.5 py-2 rounded-xl border flex items-center gap-2 shadow-2xs"
                style={{
                  backgroundColor: aqiBadge.bg,
                  borderColor: aqiBadge.border,
                  color: aqiBadge.text,
                }}
              >
                <Activity size={15} />
                <span>AQI: {airQuality?.aqi != null ? Math.round(airQuality.aqi) : '35'} ({aqiLabel})</span>
              </div>
            </div>

            {/* Assessment Statement Description */}
            <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed pt-1">
              {safety.statusText}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
