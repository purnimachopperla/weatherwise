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
      value: aqi != null ? Math.round(aqi) : '35',
      unit: '',
      sub: getAQILabel(aqi),
      icon: <Activity size={18} className="text-teal-700" />,
      badgeBg: 'bg-teal-50 text-teal-800 border-teal-200/80',
    },
    {
      id: 'uv',
      label: 'UV Radiation',
      value: uv != null ? uv.toFixed(1) : '4.5',
      unit: 'Index',
      sub: getUVLabel(uv),
      icon: <Sun size={18} className="text-amber-600" />,
      badgeBg: 'bg-amber-50 text-amber-800 border-amber-200/80',
    },
    {
      id: 'humidity',
      label: 'Relative Humidity',
      value: `${Math.round(current.humidity)}`,
      unit: '%',
      sub: getHumidityLabel(current.humidity),
      icon: <Droplets size={18} className="text-sky-600" />,
      badgeBg: 'bg-sky-50 text-sky-800 border-sky-200/80',
    },
    {
      id: 'wind',
      label: 'Wind Velocity',
      value: `${Math.round(current.wind_speed)}`,
      unit: 'km/h',
      sub: getWindLabel(current.wind_speed),
      icon: <Wind size={18} className="text-indigo-600" />,
      badgeBg: 'bg-indigo-50 text-indigo-800 border-indigo-200/80',
    },
    {
      id: 'visibility',
      label: 'Visibility',
      value: formatVisibility(current.visibility),
      unit: '',
      sub: getVisibilityLabel(current.visibility),
      icon: <Eye size={18} className="text-emerald-600" />,
      badgeBg: 'bg-emerald-50 text-emerald-800 border-emerald-200/80',
    },
    {
      id: 'pressure',
      label: 'Air Pressure',
      value: current.pressure != null ? `${Math.round(current.pressure)}` : '1012',
      unit: 'hPa',
      sub: current.pressure > 1013 ? 'High' : 'Nominal',
      icon: <Gauge size={18} className="text-slate-600" />,
      badgeBg: 'bg-slate-100 text-slate-800 border-slate-200/80',
    },
  ];

  return (
    <section aria-label="Environmental Status Metrics" className="fade-in w-full">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-5">
        {stats.map((stat) => (
          <div
            key={stat.id}
            className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200/90 hover:border-slate-300 transition-all flex flex-col justify-between shadow-2xs hover:shadow-sm min-h-[152px] sm:min-h-[160px]"
          >
            {/* Header: Icon + Label */}
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-8 h-8 rounded-xl bg-slate-100/90 flex items-center justify-center flex-shrink-0 border border-slate-200/60 shadow-2xs">
                {stat.icon}
              </div>
              <span className="text-xs font-bold text-slate-500 truncate tracking-tight">
                {stat.label}
              </span>
            </div>

            {/* Value */}
            <div className="flex items-baseline gap-1.5 my-1.5">
              <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-none">
                {stat.value}
              </span>
              {stat.unit && (
                <span className="text-xs font-bold text-slate-400">
                  {stat.unit}
                </span>
              )}
            </div>

            {/* Sublabel status badge chip */}
            <div className="mt-2 pt-2 border-t border-slate-100">
              <span className={`inline-block text-[11px] font-bold px-2.5 py-0.5 rounded-md border ${stat.badgeBg}`}>
                {stat.sub}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
