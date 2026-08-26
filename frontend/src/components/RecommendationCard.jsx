/**
 * RecommendationCard.jsx — Full-Width Personalized Lifestyle Guidance.
 *
 * WeatherWise Core Feature:
 * - Highlights AI recommendations tailored to 8 lifestyle personas
 * - Clean, spacious full-width card layout
 * - Multi-column actionable recommendation grid
 */

import {
  Wind, Sun, Thermometer, Droplets, AlertTriangle, AlertCircle,
  Activity, ShieldAlert, Eye, Umbrella, MapPin, Car, Waves,
  CalendarCheck, Users, Clock, Sparkles
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

export default function RecommendationCard({ recommendation, loading }) {
  if (loading) {
    return (
      <div className="glass-panel p-5 sm:p-7 rounded-3xl border border-white/5 space-y-4">
        <div className="skeleton h-6 w-56 rounded-lg" />
        <div className="skeleton h-14 w-full rounded-2xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="skeleton h-20 rounded-2xl" />
          <div className="skeleton h-20 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!recommendation) return null;

  const profile = getProfileByKey(recommendation.profile);

  return (
    <section aria-label="Personalized Weather Guidance" className="fade-in w-full">
      <div
        className="rounded-3xl p-5 sm:p-7 md:p-8 border transition-all"
        style={{
          borderColor: `${profile.color}25`,
          background: `linear-gradient(135deg, ${profile.color}12 0%, rgba(13, 20, 36, 0.85) 100%)`,
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
        }}
      >
        {/* Header: Persona Label + Summary */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-5 pb-4 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl flex items-center justify-center text-xl sm:text-2xl flex-shrink-0 shadow-sm"
              style={{
                background: `${profile.color}20`,
                border: `1px solid ${profile.color}35`,
              }}
            >
              {profile.emoji}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Personalized Guidance
                </span>
                <span className="inline-block w-1 h-1 rounded-full bg-cyan-400" />
                <span className="text-[11px] font-semibold text-cyan-300">Live Context</span>
              </div>
              <h3 className="text-base sm:text-lg md:text-xl font-bold text-slate-100 break-words leading-tight">
                {recommendation.profile_label}
              </h3>
            </div>
          </div>

          {/* Optimal Timing Pill */}
          {recommendation.best_time && (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-slate-300 font-medium self-start sm:self-auto">
              <Clock size={13} className="text-cyan-400 flex-shrink-0" />
              <span>Timing: <strong className="text-slate-100 font-semibold">{recommendation.best_time}</strong></span>
            </div>
          )}
        </div>

        {/* Primary Insight Summary Headline */}
        <div
          className="p-3.5 sm:p-4 rounded-2xl mb-5 border"
          style={{
            background: `${profile.color}10`,
            borderColor: `${profile.color}20`,
          }}
        >
          <p className="text-sm sm:text-base font-semibold text-slate-100 leading-relaxed break-words flex items-start gap-2">
            <Sparkles size={18} className="text-amber-400 flex-shrink-0 mt-0.5" />
            <span>{recommendation.summary}</span>
          </p>
        </div>

        {/* Grid of Actionable Guidance Items */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-3.5">
          {recommendation.items.map((item, i) => {
            const style = getSeverityStyle(item.severity);
            const IconComponent = ICON_MAP[item.icon] || Activity;

            return (
              <div
                key={i}
                className="flex items-start gap-3 p-3.5 sm:p-4 rounded-2xl border transition-all"
                style={{
                  background: style.bg,
                  borderColor: style.border,
                }}
              >
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{
                    background: `${style.text}18`,
                    color: style.text,
                  }}
                >
                  <IconComponent size={17} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-bold mb-1 break-words" style={{ color: style.text }}>
                    {item.title}
                  </p>
                  <p className="text-xs sm:text-[13px] text-slate-300 leading-relaxed break-words">
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
