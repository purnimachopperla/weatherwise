import React from 'react';
import { motion } from 'framer-motion';
import {
  HeartPulse,
  Flame,
  Plane,
  Users,
  Sprout,
  Car,
  Waves,
  PartyPopper,
} from 'lucide-react';
import type { UserProfile } from '../types/weather';

interface ProfileSelectorProps {
  selectedProfile: UserProfile;
  onSelectProfile: (profile: UserProfile) => void;
}

interface ProfileItem {
  id: UserProfile;
  label: string;
  focus: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  accentBg: string;
}

const PROFILES: ProfileItem[] = [
  {
    id: 'health',
    label: 'Health',
    focus: 'AQI & UV Index',
    icon: HeartPulse,
    color: 'text-emerald-400',
    accentBg: 'from-emerald-500/20 to-teal-500/10',
  },
  {
    id: 'fitness',
    label: 'Fitness',
    focus: 'Workout Windows',
    icon: Flame,
    color: 'text-amber-400',
    accentBg: 'from-amber-500/20 to-orange-500/10',
  },
  {
    id: 'travel',
    label: 'Travel',
    focus: 'Packing & Transit',
    icon: Plane,
    color: 'text-sky-400',
    accentBg: 'from-sky-500/20 to-blue-500/10',
  },
  {
    id: 'family',
    label: 'Family',
    focus: 'Kids & Comfort',
    icon: Users,
    color: 'text-pink-400',
    accentBg: 'from-pink-500/20 to-rose-500/10',
  },
  {
    id: 'agriculture',
    label: 'Agriculture',
    focus: 'Irrigation & Frost',
    icon: Sprout,
    color: 'text-lime-400',
    accentBg: 'from-lime-500/20 to-emerald-500/10',
  },
  {
    id: 'commuter',
    label: 'Commuter',
    focus: 'Road & Fog Hazards',
    icon: Car,
    color: 'text-indigo-400',
    accentBg: 'from-indigo-500/20 to-violet-500/10',
  },
  {
    id: 'beach',
    label: 'Beach & Surf',
    focus: 'UV & Coastal Wind',
    icon: Waves,
    color: 'text-cyan-400',
    accentBg: 'from-cyan-500/20 to-teal-500/10',
  },
  {
    id: 'event',
    label: 'Event Planner',
    focus: 'Rain Risk & Gusts',
    icon: PartyPopper,
    color: 'text-purple-400',
    accentBg: 'from-purple-500/20 to-fuchsia-500/10',
  },
];

export const ProfileSelector: React.FC<ProfileSelectorProps> = ({
  selectedProfile,
  onSelectProfile,
}) => {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2.5 px-1">
        <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Lifestyle Lens
        </div>
        <div className="text-xs text-slate-400">
          Personalized advice updates instantly
        </div>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar no-scrollbar">
        {PROFILES.map((prof) => {
          const Icon = prof.icon;
          const isSelected = selectedProfile === prof.id;

          return (
            <button
              key={prof.id}
              onClick={() => onSelectProfile(prof.id)}
              className={`relative flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-medium transition-all duration-200 flex-shrink-0 cursor-pointer ${
                isSelected
                  ? 'text-white border border-white/20 shadow-lg'
                  : 'text-slate-400 hover:text-slate-200 bg-dark-900/60 hover:bg-dark-900 border border-white/5'
              }`}
            >
              {isSelected && (
                <motion.div
                  layoutId="activeProfilePill"
                  className={`absolute inset-0 rounded-xl bg-gradient-to-r ${prof.accentBg} backdrop-blur-md`}
                  transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                />
              )}

              <span className="relative z-10 flex items-center gap-2">
                <Icon className={`w-4 h-4 ${prof.color}`} />
                <span>{prof.label}</span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
