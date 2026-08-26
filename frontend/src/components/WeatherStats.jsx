/**
 * WeatherStats.jsx — Environmental Status Metrics Grid.
 *
 * Displays: AQI, UV Index, Humidity, Wind Speed, Visibility, Pressure
 * Styled with generous padding, equal heights, and uncompressed typography.
 */

import { Wind, Droplets, Eye, Gauge, Sun, Activity } from 'lucide-react';
import {
  getAQILabel,
  getUVLabel,
  getWindLabel,
  getVisibilityLabel, formatVisibility,
  getHumidityLabel,
} from '../utils/weatherUtils';

export default function WeatherStats({ weather, airQuality }) {
  if (!weather) return null;

  const { current } = weather;
  const uv = airQuality?.uv_index;
  const aqi = airQuality?.aqi;

  const stats = [
    {
      id: 'aqi',
      label: 'Air Quality (AQI)',
      value: aqi != null ? Math.round(aqi) : 'N/A',
      unit: '',
      sub: getAQILabel(aqi),
      icon: <Activity size={18} className="text-teal-700" />,
    },
    {
      id: 'uv',
      label: 'UV Radiation',
      value: uv != null ? uv.toFixed(1) : 'N/A',
      unit: 'Index',
      sub: getUVLabel(uv),
      icon: <Sun size={18} className="text-amber-600" />,
    },
    {
      id: 'humidity',
      label: 'Relative Humidity',
      value: `${Math.round(current.humidity)}`,
      unit: '%',
      sub: getHumidityLabel(current.humidity),
      icon: <Droplets size={18} className="text-sky-600" />,
    },
    {
      id: 'wind',
      label: 'Wind Velocity',
      value: `${Math.round(current.wind_speed)}`,
      unit: 'km/h',
      sub: getWindLabel(current.wind_speed),
      icon: <Wind size={18} className="text-indigo-600" />,
    },
    {
      id: 'visibility',
      label: 'Visibility',
      value: formatVisibility(current.visibility),
      unit: '',
      sub: getVisibilityLabel(current.visibility),
      icon: <Eye size={18} className="text-emerald-600" />,
    },
    {
      id: 'pressure',
      label: 'Air Pressure',
      value: current.pressure != null ? `${Math.round(current.pressure)}` : 'N/A',
      unit: 'hPa',
      sub: current.pressure > 1013 ? 'High Pressure' : 'Normal',
      icon: <Gauge size={18} className="text-slate-600" />,
    },
  ];

  return (
    <section aria-label="Environmental Status Metrics" className="fade-in w-full">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-5 lg:gap-5">
        {stats.map((stat) => (
          <div
            key={stat.id}
            className="p-5 sm:p-5.5 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 transition-all flex flex-col justify-between shadow-2xs min-h-[148px] sm:min-h-[156px]"
          >
            {/* Header: Icon + Label */}
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-7 h-7 rounded-lg bg-slate-100/80 flex items-center justify-center flex-shrink-0 border border-slate-200/60">
                {stat.icon}
              </div>
              <span className="text-xs font-semibold text-slate-500 truncate">
                {stat.label}
              </span>
            </div>

            {/* Value */}
            <div className="flex items-baseline gap-1.5 my-1">
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-none">
                {stat.value}
              </span>
              {stat.unit && (
                <span className="text-xs font-semibold text-slate-400">
                  {stat.unit}
                </span>
              )}
            </div>

            {/* Sublabel status */}
            <div className="text-[11px] font-medium text-slate-500 truncate mt-2 pt-2 border-t border-slate-100">
              Status: <span className="font-bold text-slate-800">{stat.sub}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
