/**
 * ProfileSelector.jsx — Horizontal scrollable list of user profile pills.
 *
 * Fully responsive:
 * - Touch-optimized pill buttons (min 42px tap target)
 * - Momentum horizontal swipe on mobile
 * - High-contrast active glow and clear icons
 */

import { PROFILES } from '../utils/recommendationUtils';

export default function ProfileSelector({ activeProfile, onProfileChange }) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2 sm:mb-3">
        <p className="text-[11px] sm:text-xs text-slate-400 font-bold uppercase tracking-wider">
          Persona / Profile Mode
        </p>
        <span className="text-[11px] text-slate-500 font-medium hidden sm:inline">
          Personalized analysis adapts instantly
        </span>
      </div>

      <div
        className="flex gap-2 sm:gap-2.5 overflow-x-auto pb-2 pt-0.5 scrollbar-thin scroll-smooth w-full"
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
              className={`inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer flex-shrink-0 min-h-[40px] select-none ${
                isActive
                  ? 'text-white shadow-lg scale-[1.02] border-transparent'
                  : 'bg-slate-900/80 text-slate-300 border border-indigo-500/20 hover:border-indigo-500/40 hover:text-slate-100 hover:bg-slate-800/80'
              }`}
              style={{
                background: isActive
                  ? `linear-gradient(135deg, ${profile.color}, ${profile.color}dd)`
                  : undefined,
                boxShadow: isActive ? `0 4px 18px ${profile.color}45` : undefined,
              }}
            >
              <span className="text-base leading-none">{profile.emoji}</span>
              <span>{profile.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

