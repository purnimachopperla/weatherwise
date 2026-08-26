/**
 * ProfileSelector.jsx — Enterprise Persona Selection Strip.
 *
 * Provides quick selection between 8 stakeholder decision-support personas:
 * Health & Wellness, Athletics, Family, Commute, Agriculture, Travel, Coastal, Public Events.
 */

import { PROFILES } from '../utils/recommendationUtils';
import {
  Heart, Activity, Plane, Users, Sprout, Car, Waves, CalendarCheck, SlidersHorizontal
} from 'lucide-react';

const ICON_MAP = {
  Heart, Activity, Plane, Users, Sprout, Car, Waves, CalendarCheck
};

export default function ProfileSelector({ activeProfile, onProfileChange }) {
  return (
    <section aria-label="Stakeholder Decision Profiles" className="w-full">
      <div className="flex items-center justify-between gap-2 mb-2 px-0.5">
        <div className="flex items-center gap-1.5 text-slate-700">
          <SlidersHorizontal size={14} className="text-teal-700" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
            Decision Intelligence Persona
          </span>
        </div>
        <span className="text-[11px] text-slate-500 font-medium hidden sm:inline">
          Select target profile to evaluate tailored risk recommendations
        </span>
      </div>

      <div
        className="flex gap-2 overflow-x-auto pb-1.5 scrollbar-thin scroll-smooth w-full"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        {PROFILES.map((profile) => {
          const isActive = activeProfile === profile.key;
          const IconComp = ICON_MAP[profile.icon] || Activity;

          return (
            <button
              key={profile.key}
              onClick={() => onProfileChange(profile.key)}
              aria-pressed={isActive}
              aria-label={`Select ${profile.fullLabel}`}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all duration-150 cursor-pointer flex-shrink-0 select-none min-h-[36px] ${
                isActive
                  ? 'bg-teal-700 text-white shadow-xs border border-teal-800'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:border-slate-300'
              }`}
            >
              <IconComp size={14} className={isActive ? 'text-teal-100' : 'text-slate-500'} />
              <span>{profile.label}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
