/**
 * Settings.jsx — Responsive Application settings modal.
 *
 * Fully responsive:
 * - Fits any mobile screen without clipping
 * - Scrollable body on small screens
 * - Easy-to-tap close buttons (min 44px)
 */

import { X } from 'lucide-react';

export default function Settings({ onClose }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-3 sm:p-4 fade-in"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="w-full max-w-lg bg-slate-900/95 border border-indigo-500/30 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl shadow-black/90 flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-indigo-500/15 flex-shrink-0">
          <h2 className="text-base sm:text-lg font-bold text-slate-100">About & Settings</h2>
          <button
            onClick={onClose}
            aria-label="Close settings"
            className="w-9 h-9 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 active:bg-indigo-500/30 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1">
          {/* About */}
          <section>
            <h3 className="text-[10px] sm:text-xs text-slate-400 font-bold uppercase tracking-wider mb-2 sm:mb-3">
              Application
            </h3>
            <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20">
              <div className="flex items-center gap-3 mb-2.5">
                <span className="text-3xl">🌤️</span>
                <div>
                  <p className="text-base font-bold text-slate-100">WeatherWise</p>
                  <p className="text-xs text-cyan-300 font-medium">Smart Weather & Environment Assistant v1.0.0</p>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                WeatherWise doesn't just show weather numbers — it analyzes real-time meteorological conditions
                and generates personalized recommendations tailored to 8 lifestyle personas.
              </p>
            </div>
          </section>

          {/* Data Sources */}
          <section>
            <h3 className="text-[10px] sm:text-xs text-slate-400 font-bold uppercase tracking-wider mb-2 sm:mb-3">
              Live Data Sources
            </h3>
            <div className="flex flex-col gap-2">
              {[
                { name: 'Weather & Forecast', source: 'Open-Meteo API', free: true },
                { name: 'Air Quality (AQI)', source: 'Open-Meteo Air Quality API', free: true },
                { name: 'Location Search', source: 'Open-Meteo Geocoding API', free: true },
                { name: 'Reverse Geocoding', source: 'OpenStreetMap Nominatim', free: true },
              ].map((item) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between gap-2 p-3 rounded-xl bg-slate-950/60 border border-indigo-500/10"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-semibold text-slate-200 truncate">{item.name}</p>
                    <p className="text-[11px] text-slate-500 truncate">{item.source}</p>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md flex-shrink-0">
                    LIVE & FREE
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Tech Stack */}
          <section>
            <h3 className="text-[10px] sm:text-xs text-slate-400 font-bold uppercase tracking-wider mb-2 sm:mb-3">
              Full-Stack Architecture
            </h3>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {['React 18', 'Vite', 'Tailwind CSS', 'Recharts', 'FastAPI', 'Python 3.11', 'SQLite', 'Open-Meteo'].map((tech) => (
                <span
                  key={tech}
                  className="text-xs font-semibold text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-1 rounded-lg"
                >
                  {tech}
                </span>
              ))}
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="px-5 sm:px-6 py-3.5 border-t border-indigo-500/15 flex justify-end bg-slate-950/50 flex-shrink-0">
          <button
            className="btn-primary !py-2 !px-5 text-xs sm:text-sm rounded-xl font-bold"
            onClick={onClose}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

