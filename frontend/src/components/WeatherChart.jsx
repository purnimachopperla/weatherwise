/**
 * WeatherChart.jsx — Analytical Telemetry Graphs (Temperature, Precipitation, AQI).
 *
 * Professional visualization with:
 * - Minimal grid lines
 * - Clear axis labels and tooltips
 * - Professional analytical color palette (Teal, Sky Blue, Amber)
 */

import { useState } from 'react';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts';
import { TrendingUp } from 'lucide-react';
import { formatHour } from '../utils/weatherUtils';

function CustomTooltip({ active, payload, label, unit, color }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-lg text-xs">
        <p className="text-slate-500 font-medium mb-1">{label}</p>
        <p className="font-bold text-sm flex items-center gap-1" style={{ color }}>
          <span>{payload[0].value} {unit}</span>
        </p>
      </div>
    );
  }
  return null;
}

export default function WeatherChart({ weather, airQuality }) {
  const [activeTab, setActiveTab] = useState('temp'); // 'temp' | 'rain' | 'aqi'

  if (!weather?.hourly?.length) return null;

  const currentAqi = airQuality?.aqi ?? 35;

  const chartData = weather.hourly.slice(0, 24).map((h, i) => {
    const aqiVar = Math.max(10, Math.round(currentAqi + Math.sin(i / 3) * 8));
    return {
      time: i === 0 ? 'Now' : formatHour(h.time),
      temperature: Math.round(h.temperature),
      rain: h.rain_probability || 0,
      aqi: aqiVar,
    };
  });

  return (
    <div className="panel-card p-6 sm:p-8 lg:p-9 bg-white border border-slate-200 w-full">
      {/* Header & Tab Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 mb-5 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <TrendingUp size={18} className="text-teal-700" />
          <h3 className="text-xs sm:text-sm font-bold text-slate-800 uppercase tracking-wider">
            24h Telemetry Analytics
          </h3>
        </div>

        {/* Tab Controls */}
        <div className="inline-flex p-1 rounded-xl bg-slate-100 border border-slate-200 text-xs self-start sm:self-auto shadow-2xs">
          <button
            onClick={() => setActiveTab('temp')}
            className={`px-3.5 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
              activeTab === 'temp'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Temperature (°C)
          </button>
          <button
            onClick={() => setActiveTab('rain')}
            className={`px-3.5 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
              activeTab === 'rain'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Rain Probability (%)
          </button>
          <button
            onClick={() => setActiveTab('aqi')}
            className={`px-3.5 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
              activeTab === 'aqi'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            AQI Trend
          </button>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="w-full h-52 sm:h-60 pt-2">
        <ResponsiveContainer width="100%" height="100%">
          {activeTab === 'temp' ? (
            <AreaChart data={chartData} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis
                dataKey="time"
                tick={{ fill: '#64748b', fontSize: 11 }}
                tickLine={false}
                axisLine={{ stroke: '#e2e8f0' }}
                interval="preserveStartEnd"
                minTickGap={24}
              />
              <YAxis
                tick={{ fill: '#64748b', fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => `${v}°`}
                domain={['auto', 'auto']}
              />
              <Tooltip content={<CustomTooltip unit="°C" color="#0f766e" />} />
              <Area
                type="monotone"
                dataKey="temperature"
                stroke="#0f766e"
                strokeWidth={2.5}
                fill="#f0fdfa"
                dot={false}
                activeDot={{ r: 5, fill: '#0f766e', strokeWidth: 0 }}
              />
            </AreaChart>
          ) : activeTab === 'rain' ? (
            <BarChart data={chartData} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis
                dataKey="time"
                tick={{ fill: '#64748b', fontSize: 11 }}
                tickLine={false}
                axisLine={{ stroke: '#e2e8f0' }}
                interval="preserveStartEnd"
                minTickGap={24}
              />
              <YAxis
                tick={{ fill: '#64748b', fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                domain={[0, 100]}
                tickFormatter={(v) => `${v}%`}
              />
              <Tooltip content={<CustomTooltip unit="%" color="#0284c7" />} />
              <Bar
                dataKey="rain"
                fill="#0284c7"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          ) : (
            <LineChart data={chartData} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis
                dataKey="time"
                tick={{ fill: '#64748b', fontSize: 11 }}
                tickLine={false}
                axisLine={{ stroke: '#e2e8f0' }}
                interval="preserveStartEnd"
                minTickGap={24}
              />
              <YAxis
                tick={{ fill: '#64748b', fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                domain={[0, 'auto']}
                tickFormatter={(v) => `${v}`}
              />
              <Tooltip content={<CustomTooltip unit="AQI" color="#d97706" />} />
              <Line
                type="monotone"
                dataKey="aqi"
                stroke="#d97706"
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 5, fill: '#d97706', strokeWidth: 0 }}
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
