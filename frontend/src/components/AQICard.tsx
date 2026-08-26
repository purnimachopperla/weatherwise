import React from 'react';
import { motion } from 'framer-motion';
import { Wind, AlertTriangle, Activity, ShieldCheck } from 'lucide-react';
import type { AirQualityResponse } from '../types/weather';
import { getAQIColor } from '../utils/formatters';

interface AQICardProps {
  airQuality: AirQualityResponse;
}

export const AQICard: React.FC<AQICardProps> = ({ airQuality }) => {
  const aqi = airQuality.aqi || 30;
  const aqiStyle = getAQIColor(aqi);

  // Pollutants data with standard benchmark thresholds
  const pollutants = [
    {
      name: 'PM2.5',
      fullName: 'Fine Particulate Matter',
      value: airQuality.pm2_5 ?? 10.0,
      unit: 'µg/m³',
      max: 60,
      safeMax: 15,
    },
    {
      name: 'PM10',
      fullName: 'Coarse Particulate Matter',
      value: airQuality.pm10 ?? 20.0,
      unit: 'µg/m³',
      max: 100,
      safeMax: 45,
    },
    {
      name: 'O₃',
      fullName: 'Ozone',
      value: airQuality.ozone ?? 35.0,
      unit: 'µg/m³',
      max: 120,
      safeMax: 100,
    },
    {
      name: 'NO₂',
      fullName: 'Nitrogen Dioxide',
      value: airQuality.nitrogen_dioxide ?? 15.0,
      unit: 'µg/m³',
      max: 100,
      safeMax: 40,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.1 }}
      className="p-4 sm:p-6 rounded-2xl glass-card border border-white/10 relative overflow-hidden flex flex-col justify-between"
    >
      {/* Top Header */}
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <Wind className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-display text-sm sm:text-base font-bold text-white">Air Quality Index</h3>
            <p className="text-[11px] sm:text-xs text-slate-400">European Air Quality Standard (EAQI)</p>
          </div>
        </div>

        <div className={`px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full text-[11px] sm:text-xs font-semibold border ${aqiStyle.bg} ${aqiStyle.text} ${aqiStyle.border}`}>
          {airQuality.aqi_category || 'Moderate'}
        </div>
      </div>

      {/* Main AQI Readout & Visual Gauge */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center py-2">
        {/* Left: Score & Meter */}
        <div className="flex items-center gap-4">
          <div className="relative flex items-center justify-center w-24 h-24">
            {/* SVG Circular Progress Track */}
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-white/10"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <motion.path
                initial={{ strokeDasharray: '0, 100' }}
                animate={{ strokeDasharray: `${Math.min(100, Math.round((aqi / 100) * 100))}, 100` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className={aqiStyle.text}
                strokeWidth="3.5"
                strokeDasharray="0, 100"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="font-display text-2xl font-bold text-white">
                {Math.round(aqi)}
              </span>
              <span className="text-[9px] uppercase tracking-wider text-slate-400">
                AQI
              </span>
            </div>
          </div>

          <div>
            <div className="text-sm font-semibold text-slate-200">
              {aqi <= 20
                ? 'Pristine Atmosphere'
                : aqi <= 40
                ? 'Healthy Air Quality'
                : aqi <= 60
                ? 'Moderate Pollution'
                : 'Elevated Particle Level'}
            </div>
            <div className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
              {aqi <= 40 ? (
                <>
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Ideal for all outdoor activities</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                  <span>Sensitive groups limit exertion</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right: Pollutants Breakdown */}
        <div className="space-y-2.5">
          {pollutants.map((item) => {
            const percentage = Math.min(100, Math.round((item.value / item.max) * 100));
            const isElevated = item.value > item.safeMax;

            return (
              <div key={item.name} className="space-y-1">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-300 font-medium">{item.name}</span>
                  <span className={isElevated ? 'text-amber-400' : 'text-slate-400'}>
                    {item.value.toFixed(1)} {item.unit}
                  </span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className={`h-full rounded-full ${
                      isElevated ? 'bg-amber-400' : 'bg-cyan-400'
                    }`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Health Tip */}
      <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400">
        <span className="flex items-center gap-1">
          <Activity className="w-3 h-3 text-cyan-400" />
          <span>Real-time environmental sensor feed</span>
        </span>
        <span className="font-mono text-slate-400">UV: {airQuality.uv_index?.toFixed(1) ?? '--'}</span>
      </div>
    </motion.div>
  );
};
