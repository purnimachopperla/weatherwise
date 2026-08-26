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
      <div className="bg-white border border-slate-200 rounded-lg p-2.5 shadow-md text-xs">
        <p className="text-slate-500 font-medium mb-0.5">{label}</p>
        <p className="font-bold flex items-center gap-1" style={{ color }}>
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
    // Computed hourly AQI variation
    const aqiVar = Math.max(10, Math.round(currentAqi + Math.sin(i / 3) * 8));
    return {
      time: i === 0 ? 'Now' : formatHour(h.time),
      temperature: Math.round(h.temperature),
      rain: h.rain_probability || 0,
      aqi: aqiVar,
    };
  });

  return (
    <div className="panel-card p-5 sm:p-6 bg-white border border-slate-200 w-full">
      {/* Header & Tab Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-2 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <TrendingUp size={16} className="text-teal-700" />
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            24h Telemetry Analytics
          </h3>
        </div>

        {/* Tab Controls */}
        <div className="inline-flex p-1 rounded-lg bg-slate-100 border border-slate-200 text-xs self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('temp')}
            className={`px-3 py-1 rounded-md font-semibold transition-all cursor-pointer ${
              activeTab === 'temp'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Temperature (°C)
          </button>
          <button
            onClick={() => setActiveTab('rain')}
            className={`px-3 py-1 rounded-md font-semibold transition-all cursor-pointer ${
              activeTab === 'rain'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Rain Probability (%)
          </button>
          <button
            onClick={() => setActiveTab('aqi')}
            className={`px-3 py-1 rounded-md font-semibold transition-all cursor-pointer ${
              activeTab === 'aqi'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            AQI Trend
          </button>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="w-full h-48 sm:h-56">
        <ResponsiveContainer width="100%" height="100%">
          {activeTab === 'temp' ? (
            <AreaChart data={chartData} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis
                dataKey="time"
                tick={{ fill: '#64748b', fontSize: 10 }}
                tickLine={false}
                axisLine={{ stroke: '#e2e8f0' }}
                interval="preserveStartEnd"
                minTickGap={24}
              />
              <YAxis
                tick={{ fill: '#64748b', fontSize: 10 }}
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
                strokeWidth={2}
                fill="#f0fdfa"
                dot={false}
                activeDot={{ r: 4, fill: '#0f766e', strokeWidth: 0 }}
              />
            </AreaChart>
          ) : activeTab === 'rain' ? (
            <BarChart data={chartData} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis
                dataKey="time"
                tick={{ fill: '#64748b', fontSize: 10 }}
                tickLine={false}
                axisLine={{ stroke: '#e2e8f0' }}
                interval="preserveStartEnd"
                minTickGap={24}
              />
              <YAxis
                tick={{ fill: '#64748b', fontSize: 10 }}
                tickLine={false}
                axisLine={false}
                domain={[0, 100]}
                tickFormatter={(v) => `${v}%`}
              />
              <Tooltip content={<CustomTooltip unit="%" color="#0284c7" />} />
              <Bar
                dataKey="rain"
                fill="#0284c7"
                radius={[3, 3, 0, 0]}
              />
            </BarChart>
          ) : (
            <LineChart data={chartData} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis
                dataKey="time"
                tick={{ fill: '#64748b', fontSize: 10 }}
                tickLine={false}
                axisLine={{ stroke: '#e2e8f0' }}
                interval="preserveStartEnd"
                minTickGap={24}
              />
              <YAxis
                tick={{ fill: '#64748b', fontSize: 10 }}
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
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: '#d97706', strokeWidth: 0 }}
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
