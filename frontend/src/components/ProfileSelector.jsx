/**
 * ProfileSelector.jsx — Persona selection horizontal pill bar.
 *
 * Allows switching between 8 lifestyle personas:
 * Health-Conscious, Fitness/Runner, Parent/Kids, Commuter,
 * Outdoor Enthusiast, Farmer/Gardener, Event Planner, Senior Citizen.
 */

import { PROFILES } from '../utils/recommendationUtils';
import { UserCheck } from 'lucide-react';

export default function ProfileSelector({ activeProfile, onProfileChange }) {
  return (
    <section aria-label="Lifestyle Persona Selector" className="w-full">
      <div className="flex items-center justify-between gap-2 mb-2 px-1">
        <div className="flex items-center gap-1.5">
          <UserCheck size={14} className="text-cyan-400" />
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Lifestyle Persona
          </span>
        </div>
        <span className="text-[11px] text-slate-500 font-medium hidden sm:inline">
          Select your lifestyle mode
        </span>
      </div>

      <div
        className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin scroll-smooth w-full"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        {PROFILES.map((profile) => {
          const isActive = activeProfile === profile.key;
          return (
            <button
              key={profile.key}
              onClick={() => onProfileChange(profile.key)}
              aria-pressed={isActive}
              aria-label={`Switch to ${profile.fullLabel} profile`}
              className={`inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer flex-shrink-0 select-none min-h-[38px] ${
                isActive
                  ? 'text-white shadow-lg border-transparent'
                  : 'bg-slate-900/70 text-slate-300 border border-white/5 hover:border-white/20 hover:text-white hover:bg-slate-800/70'
              }`}
              style={{
                background: isActive
                  ? `linear-gradient(135deg, ${profile.color}, ${profile.color}dd)`
                  : undefined,
                boxShadow: isActive ? `0 4px 16px ${profile.color}40` : undefined,
              }}
            >
              <span className="text-sm sm:text-base leading-none">{profile.emoji}</span>
              <span>{profile.label}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
