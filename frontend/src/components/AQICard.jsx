/**
 * AQICard.jsx — Modern Air Quality Index & Pollutant Breakdown.
 *
 * Visual Features:
 * - Color-coded AQI score badge and gauge
 * - Detailed breakdown of PM2.5, PM10, Ozone, NO2
 * - Fits cleanly into the split dashboard grid
 */

import { Activity, Wind } from 'lucide-react';
import { getAQIColor, getAQILabel } from '../utils/weatherUtils';

export default function AQICard({ airQuality }) {
  if (!airQuality) return null;

  const aqi = airQuality.aqi;
  const aqiColor = getAQIColor(aqi);
  const aqiLabel = getAQILabel(aqi);

  // Map AQI (0–150) to 0–100% width
  const gaugePercent = aqi != null ? Math.min((aqi / 150) * 100, 100) : 0;

  const pollutants = [
    { label: 'PM2.5', value: airQuality.pm2_5, unit: 'µg/m³', limit: 25 },
    { label: 'PM10',  value: airQuality.pm10,  unit: 'µg/m³', limit: 50 },
    { label: 'Ozone', value: airQuality.ozone, unit: 'µg/m³', limit: 120 },
    { label: 'NO₂',   value: airQuality.nitrogen_dioxide, unit: 'µg/m³', limit: 40 },
  ].filter(p => p.value != null);

  return (
    <div className="glass-panel p-5 sm:p-6 rounded-3xl border border-white/5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Activity size={16} className="text-cyan-400" />
          <h3 className="text-xs sm:text-sm font-bold text-slate-300 uppercase tracking-wider">
            Air Quality Index
          </h3>
        </div>
        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
          Live Data
        </span>
      </div>

      {/* AQI Big Score & Category */}
      <div className="flex items-center gap-4 mb-4">
        <div
          className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center flex-shrink-0 border shadow-md"
          style={{
            background: `${aqiColor}15`,
            borderColor: `${aqiColor}40`,
          }}
        >
          <span className="text-2xl sm:text-3xl font-black" style={{ color: aqiColor }}>
            {aqi != null ? Math.round(aqi) : '—'}
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-base sm:text-lg font-bold leading-tight break-words" style={{ color: aqiColor }}>
            {aqiLabel}
          </p>
          <p className="text-xs text-slate-400 font-medium mt-0.5">European Air Quality Standard</p>
        </div>
      </div>

      {/* Gauge Bar */}
      <div className="mb-5">
        <div className="h-2 rounded-full bg-gradient-to-r from-emerald-500 via-amber-500 to-purple-600 relative">
          <div
            className="absolute -top-1 w-4 h-4 rounded-full bg-white border-2 shadow-md transition-all duration-300"
            style={{
              left: `${gaugePercent}%`,
              transform: 'translateX(-50%)',
              borderColor: aqiColor,
            }}
          />
        </div>
        <div className="flex justify-between mt-1.5 text-[10px] text-slate-500 font-semibold">
          <span>0 Good</span>
          <span>75 Moderate</span>
          <span>150+ Hazardous</span>
        </div>
      </div>

      {/* Key Pollutants Grid */}
      {pollutants.length > 0 && (
        <div>
          <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mb-2.5">
            Key Pollutants
          </p>
          <div className="grid grid-cols-2 gap-2.5">
            {pollutants.map((p) => {
              const pct = Math.min((p.value / p.limit) * 100, 100);
              const color = pct > 80 ? '#ef4444' : pct > 50 ? '#f97316' : '#10b981';
              return (
                <div
                  key={p.label}
                  className="p-2.5 rounded-xl bg-slate-950/60 border border-white/5 flex flex-col justify-between"
                >
                  <div className="flex items-baseline justify-between gap-1 mb-1.5">
                    <span className="text-xs text-slate-400 font-medium">{p.label}</span>
                    <span className="text-xs font-bold" style={{ color }}>
                      {p.value.toFixed(1)} <span className="text-[10px] text-slate-500 font-normal">{p.unit}</span>
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%`, background: color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
