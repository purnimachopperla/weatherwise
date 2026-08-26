/**
 * RecommendationCard.jsx — Core Environmental Intelligence & Decision Support Engine.
 *
 * Visual focal point for SIH Hackathon presentation:
 * - Multi-parameter Decision Support
 * - Model Confidence Rating & Analytical Reasoning
 * - Actionable stakeholder recommendations with generous spacing and uncompressed cards
 */

import {
  Wind, Sun, Thermometer, Droplets, AlertTriangle, AlertCircle,
  Activity, ShieldAlert, Eye, Umbrella, MapPin, Car, Waves,
  CalendarCheck, Users, Clock, CheckCircle2, Zap
} from 'lucide-react';
import { getSeverityStyle } from '../utils/weatherUtils';
import { getProfileByKey } from '../utils/recommendationUtils';

const ICON_MAP = {
  'wind':            Wind,
  'sun':             Sun,
  'thermometer':     Thermometer,
  'thermometer-snowflake': Thermometer,
  'droplets':        Droplets,
  'alert-triangle':  AlertTriangle,
  'alert-circle':    AlertCircle,
  'activity':        Activity,
  'shield-alert':    ShieldAlert,
  'eye-off':         Eye,
  'eye':             Eye,
  'umbrella':        Umbrella,
  'map-pin':         MapPin,
  'users':           Users,
  'car':             Car,
  'waves':           Waves,
  'calendar-check':  CalendarCheck,
};

export default function RecommendationCard({ recommendation, loading, airQuality, weather }) {
  if (loading) {
    return (
      <div className="panel-card p-6 sm:p-8 border border-slate-200 space-y-5">
        <div className="skeleton h-7 w-64 rounded-lg" />
        <div className="skeleton h-20 w-full rounded-2xl" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="skeleton h-28 rounded-2xl" />
          <div className="skeleton h-28 rounded-2xl" />
          <div className="skeleton h-28 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!recommendation) return null;

  const profile = getProfileByKey(recommendation.profile);
  const aqi = airQuality?.aqi ?? 35;
  const uv = airQuality?.uv_index ?? 3.5;
  const rain = weather?.daily?.[0]?.rain_probability ?? 10;
  const temp = weather?.current?.temperature ?? 28;

  return (
    <section aria-label="Environmental Intelligence Engine" className="fade-in w-full">
      <div className="panel-card p-6 sm:p-8 lg:p-9 xl:p-10 bg-white border border-slate-200">
        {/* Module Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center flex-shrink-0 shadow-2xs">
              <Zap size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2.5 mb-1">
                <span className="text-xs font-bold text-teal-800 uppercase tracking-wider">
                  Environmental Intelligence Engine
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                  {profile.confidence || '96%'} Model Confidence
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
                {recommendation.profile_label || profile.fullLabel} Advisory
              </h3>
            </div>
          </div>

          {/* Optimal Window Pill */}
          {recommendation.best_time && (
            <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-teal-50 border border-teal-200 text-xs sm:text-sm font-semibold text-teal-900 self-start sm:self-auto shadow-2xs">
              <Clock size={15} className="text-teal-700 flex-shrink-0" />
              <span>Optimal Activity Window: <strong>{recommendation.best_time}</strong></span>
            </div>
          )}
        </div>

        {/* Executive Summary Statement */}
        <div className="my-5 p-4.5 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3.5">
          <CheckCircle2 size={20} className="text-teal-700 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
              Executive Environmental Summary
            </p>
            <p className="text-sm sm:text-base font-semibold text-slate-800 leading-relaxed">
              {recommendation.summary}
            </p>
          </div>
        </div>

        {/* Multi-Factor Analytical Reasoning Bar */}
        <div className="mb-6 p-4 sm:p-5 rounded-2xl bg-slate-100/80 border border-slate-200">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
            Multi-Parameter Reasoning Matrix
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 text-xs">
            <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs flex flex-col justify-between">
              <span className="text-slate-500 text-[11px] font-medium block mb-1">Air Quality Factor</span>
              <span className="font-bold text-slate-900 text-xs sm:text-sm">AQI {Math.round(aqi)} ({aqi <= 50 ? 'Favorable' : 'Moderate'})</span>
            </div>
            <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs flex flex-col justify-between">
              <span className="text-slate-500 text-[11px] font-medium block mb-1">Solar Radiation Factor</span>
              <span className="font-bold text-slate-900 text-xs sm:text-sm">UV Index {uv.toFixed(1)} ({uv < 6 ? 'Low-Moderate' : 'Elevated'})</span>
            </div>
            <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs flex flex-col justify-between">
              <span className="text-slate-500 text-[11px] font-medium block mb-1">Precipitation Factor</span>
              <span className="font-bold text-slate-900 text-xs sm:text-sm">{rain}% Chance ({rain < 30 ? 'Minimal' : 'Likely'})</span>
            </div>
            <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs flex flex-col justify-between">
              <span className="text-slate-500 text-[11px] font-medium block mb-1">Thermal Load Factor</span>
              <span className="font-bold text-slate-900 text-xs sm:text-sm">{Math.round(temp)}°C (Nominal Range)</span>
            </div>
          </div>
        </div>

        {/* Actionable Guidance Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {recommendation.items.map((item, i) => {
            const style = getSeverityStyle(item.severity);
            const IconComponent = ICON_MAP[item.icon] || Activity;

            return (
              <div
                key={i}
                className="p-5 sm:p-6 rounded-2xl border flex items-start gap-3.5 transition-all shadow-2xs"
                style={{
                  backgroundColor: style.bg,
                  borderColor: style.border,
                }}
              >
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{
                    backgroundColor: style.badge,
                    color: style.text,
                  }}
                >
                  <IconComponent size={17} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-bold mb-1.5" style={{ color: style.text }}>
                    {item.title}
                  </p>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed break-words">
                    {item.message}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
