/**
 * CurrentWeather.jsx — Enterprise Environmental Status & Hero Metric Overview.
 *
 * Professional layout presenting:
 * - Station Location & Meteorological Telemetry
 * - High-precision temperature and feels-like data
 * - Integrated Environmental Safety Score & Real-Time Risk Level
 */

import {
  MapPin, ArrowUp, ArrowDown, ShieldCheck,
  Sun, CloudSun, Cloud, CloudFog, CloudDrizzle, CloudRain, CloudSnow, CloudLightning,
  Activity, CheckCircle2, AlertTriangle, AlertCircle
} from 'lucide-react';
import { calculateEnvironmentalSafety, getAQIBadgeStyle, getAQILabel } from '../utils/weatherUtils';

const ICON_COMPONENTS = {
  Sun, CloudSun, Cloud, CloudFog, CloudDrizzle, CloudRain, CloudSnow, CloudLightning
};

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
      <div className="panel-card p-5 sm:p-7 md:p-8 bg-white border border-slate-200">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Left Column: Location, Temperature, Weather Condition (lg:col-span-7) */}
          <div className="lg:col-span-7 flex flex-col items-start min-w-0">
            {/* Station / Location Pill */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 mb-3.5">
              <MapPin size={13} className="text-teal-700 flex-shrink-0" />
              <span className="truncate">
                {location?.name || weather.location}
                {location?.country && <span className="text-slate-500 font-normal">, {location.country}</span>}
              </span>
              <span className="text-[10px] text-teal-700 font-bold bg-teal-50 px-1.5 py-0.2 rounded border border-teal-200 ml-1">
                LIVE
              </span>
            </div>

            {/* Main Temperature & Weather Icon Group */}
            <div className="flex items-center gap-5 sm:gap-7 my-1">
              <div className="flex items-baseline">
                <span className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-slate-900 tracking-tight leading-none">
                  {Math.round(current.temperature)}°
                </span>
                <span className="text-xl sm:text-2xl font-semibold text-slate-500 ml-0.5">C</span>
              </div>

              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-700 flex-shrink-0">
                <WeatherIcon size={28} />
              </div>
            </div>

            {/* Condition Label */}
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-800 tracking-tight mt-1 mb-2">
              {current.weather_condition}
            </h2>

            {/* Telemetry metadata: Feels like, High/Low, Humidity */}
            <div className="flex items-center gap-3 sm:gap-4 flex-wrap text-xs sm:text-sm text-slate-600">
              <span className="font-medium">
                Feels like <strong className="text-slate-900 font-semibold">{Math.round(current.feels_like)}°C</strong>
              </span>

              <span className="text-slate-300">•</span>

              {today && (
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-0.5 font-semibold text-slate-700 text-xs">
                    <ArrowUp size={12} className="text-rose-600" />
                    H: {Math.round(today.temp_max)}°
                  </span>
                  <span className="inline-flex items-center gap-0.5 font-semibold text-slate-700 text-xs">
                    <ArrowDown size={12} className="text-sky-600" />
                    L: {Math.round(today.temp_min)}°
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Environmental Safety Index & Risk Assessment (lg:col-span-5) */}
          <div className="lg:col-span-5 flex flex-col justify-center p-4 sm:p-5 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between gap-2 mb-3 pb-2.5 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-teal-700" />
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Environmental Safety Index
                </span>
              </div>
              <span
                className="text-[11px] font-bold px-2.5 py-0.5 rounded-full border"
                style={{
                  backgroundColor: safety.level === 'LOW' ? '#f0fdf4' : safety.level === 'MODERATE' ? '#fffbeb' : '#fef2f2',
                  borderColor: safety.level === 'LOW' ? '#bbf7d0' : safety.level === 'MODERATE' ? '#fde68a' : '#fecaca',
                  color: safety.level === 'LOW' ? '#15803d' : safety.level === 'MODERATE' ? '#b45309' : '#b91c1c',
                }}
              >
                {safety.level} RISK
              </span>
            </div>

            {/* Score Display */}
            <div className="flex items-baseline justify-between mb-2">
              <div>
                <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                  {safety.score}
                </span>
                <span className="text-sm font-semibold text-slate-500"> / 100</span>
              </div>
              <div
                className="text-xs font-bold px-2.5 py-1 rounded-md border flex items-center gap-1.5"
                style={{
                  backgroundColor: aqiBadge.bg,
                  borderColor: aqiBadge.border,
                  color: aqiBadge.text,
                }}
              >
                <Activity size={13} />
                <span>AQI: {airQuality?.aqi != null ? Math.round(airQuality.aqi) : '35'} ({aqiLabel})</span>
              </div>
            </div>

            {/* Assessment Statement */}
            <p className="text-xs text-slate-600 leading-relaxed">
              {safety.statusText}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
