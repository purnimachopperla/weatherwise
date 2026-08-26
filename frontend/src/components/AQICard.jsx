/**
 * AQICard.jsx — Environmental Air Quality & Atmospheric Pollution Index.
 *
 * Visual Features:
 * - Analytical AQI Level Gauge
 * - Sensor breakdown for PM2.5, PM10, Ozone, NO2
 * - European / WHO Air Quality Standards telemetry
 */

import { Activity, ShieldCheck } from 'lucide-react';
import { getAQIColor, getAQILabel, getAQIBadgeStyle } from '../utils/weatherUtils';

export default function AQICard({ airQuality }) {
  if (!airQuality) return null;

  const aqi = airQuality.aqi;
  const aqiColor = getAQIColor(aqi);
  const aqiLabel = getAQILabel(aqi);
  const badgeStyle = getAQIBadgeStyle(aqi);

  // Map AQI (0–150) to 0–100% width
  const gaugePercent = aqi != null ? Math.min((aqi / 150) * 100, 100) : 0;

  const pollutants = [
    { label: 'PM2.5 (Fine Particulates)', value: airQuality.pm2_5, unit: 'µg/m³', limit: 25 },
    { label: 'PM10 (Coarse Particulates)', value: airQuality.pm10,  unit: 'µg/m³', limit: 50 },
    { label: 'O₃ (Surface Ozone)',        value: airQuality.ozone, unit: 'µg/m³', limit: 120 },
    { label: 'NO₂ (Nitrogen Dioxide)',    value: airQuality.nitrogen_dioxide, unit: 'µg/m³', limit: 40 },
  ].filter(p => p.value != null);

  return (
    <div className="panel-card p-5 sm:p-6 bg-white border border-slate-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Activity size={16} className="text-teal-700" />
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Air Quality & Atmospheric Pollution
          </h3>
        </div>
        <span className="text-[10px] font-bold text-teal-800 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded">
          Continuous Monitoring
        </span>
      </div>

      {/* AQI Score & Status Badge */}
      <div className="flex items-center gap-4 mb-4 p-3 rounded-xl bg-slate-50 border border-slate-200">
        <div
          className="w-13 h-13 rounded-xl flex items-center justify-center flex-shrink-0 border font-extrabold text-2xl shadow-2xs"
          style={{
            backgroundColor: badgeStyle.bg,
            borderColor: badgeStyle.border,
            color: badgeStyle.text,
          }}
        >
          {aqi != null ? Math.round(aqi) : '—'}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Status:</span>
            <span className="text-sm font-bold" style={{ color: aqiColor }}>
              {aqiLabel}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">European Air Quality Standard (EAQI)</p>
        </div>
      </div>

      {/* Gauge Bar */}
      <div className="mb-5">
        <div className="h-2 rounded-full bg-slate-100 relative overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${gaugePercent}%`,
              backgroundColor: aqiColor,
            }}
          />
        </div>
        <div className="flex justify-between mt-1 text-[10px] text-slate-400 font-semibold">
          <span>0 (Good)</span>
          <span>50 (Moderate)</span>
          <span>100 (Unhealthy)</span>
          <span>150+ (Hazardous)</span>
        </div>
      </div>

      {/* Pollutants Breakdown */}
      {pollutants.length > 0 && (
        <div className="space-y-2.5">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            Pollutant Concentration Metrics
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {pollutants.map((p) => {
              const pct = Math.min((p.value / p.limit) * 100, 100);
              const isAlert = pct > 80;

              return (
                <div
                  key={p.label}
                  className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex flex-col justify-between"
                >
                  <div className="flex items-baseline justify-between gap-1 mb-1">
                    <span className="text-[11px] font-medium text-slate-700">{p.label}</span>
                    <span className="text-xs font-bold text-slate-900">
                      {p.value.toFixed(1)} <span className="text-[10px] text-slate-500 font-normal">{p.unit}</span>
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full bg-slate-200 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        isAlert ? 'bg-rose-600' : pct > 50 ? 'bg-amber-500' : 'bg-teal-600'
                      }`}
                      style={{ width: `${pct}%` }}
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
