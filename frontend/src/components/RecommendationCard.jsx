/**
 * RecommendationCard.jsx — Personalized weather recommendation display.
 *
 * The "star" feature of WeatherWise.
 * Shows the profile-specific summary and detailed recommendation items.
 * Responsive: Scales seamlessly across mobile, tablet, and desktop screens.
 */

import {
  Wind, Sun, Thermometer, Droplets, AlertTriangle, AlertCircle,
  Activity, ShieldAlert, Eye, Umbrella, MapPin, Car, Waves,
  CalendarCheck, Users, Leaf, Backpack,
} from 'lucide-react';
import { getSeverityStyle } from '../utils/weatherUtils';
import { getProfileByKey } from '../utils/recommendationUtils';

// Map icon names from the backend to Lucide components
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
  'backpack':        Backpack,
  'snowflake':       Droplets,
  'cloud-lightning': AlertCircle,
  'cloud-rain':      Droplets,
  'cloud-drizzle':   Droplets,
  'users':           Users,
  'car':             Car,
  'waves':           Waves,
  'calendar-check':  CalendarCheck,
};

export default function RecommendationCard({ recommendation, loading }) {
  if (loading) {
    return (
      <div className="glass-card-static p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-indigo-500/20">
        <div className="skeleton h-5 w-48 rounded-lg mb-4" />
        <div className="skeleton h-4 w-full rounded mb-2" />
        <div className="skeleton h-4 w-3/4 rounded mb-6" />
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="skeleton h-16 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!recommendation) return null;

  const profile = getProfileByKey(recommendation.profile);

  return (
    <div
      className="glass-card-static fade-in p-4 sm:p-6 rounded-2xl sm:rounded-3xl border"
      style={{
        borderColor: `${profile.color}35`,
        background: `linear-gradient(135deg, ${profile.color}10 0%, rgba(15,23,42,0.85) 100%)`,
      }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-3.5 sm:mb-4">
        <div
          className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl flex items-center justify-center text-xl sm:text-2xl flex-shrink-0 shadow-md"
          style={{
            background: `${profile.color}25`,
            border: `1px solid ${profile.color}45`,
          }}
        >
          {profile.emoji}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] sm:text-[11px] text-slate-400 font-bold uppercase tracking-wider">
            Personalized Guidance
          </p>
          <h3 className="text-base sm:text-lg font-bold text-slate-100 break-words leading-tight">
            {recommendation.profile_label}
          </h3>
        </div>
      </div>

      {/* Summary headline */}
      <div
        className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl mb-3.5 sm:mb-4 border"
        style={{
          background: `${profile.color}15`,
          borderColor: `${profile.color}30`,
        }}
      >
        <p className="text-sm sm:text-base font-bold text-slate-100 leading-snug break-words">
          💡 {recommendation.summary}
        </p>
      </div>

      {/* Detailed items */}
      <div className="flex flex-col gap-2 sm:gap-2.5 mb-3.5 sm:mb-4">
        {recommendation.items.map((item, i) => {
          const style = getSeverityStyle(item.severity);
          const IconComponent = ICON_MAP[item.icon] || Activity;

          return (
            <div
              key={i}
              className="flex items-start gap-2.5 sm:gap-3 p-3 rounded-xl sm:rounded-2xl border transition-all"
              style={{
                background: style.bg,
                borderColor: style.border,
              }}
            >
              <div
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{
                  background: `${style.text}20`,
                  color: style.text,
                }}
              >
                <IconComponent size={16} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-bold mb-0.5 break-words" style={{ color: style.text }}>
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

      {/* Best time */}
      <div className="p-3 sm:p-3.5 rounded-xl sm:rounded-2xl bg-indigo-500/10 border border-indigo-500/20">
        <p className="text-[10px] sm:text-[11px] text-cyan-300 font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5">
          <span>⏰ Optimal Timing</span>
        </p>
        <p className="text-xs sm:text-[13px] text-slate-300 leading-relaxed break-words">
          {recommendation.best_time}
        </p>
      </div>
    </div>
  );
}

