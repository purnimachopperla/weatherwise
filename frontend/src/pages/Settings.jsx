/**
 * Settings.jsx — Platform Architecture & Documentation Modal.
 *
 * Professional presentation for Smart India Hackathon evaluators.
 */

import { X, ShieldCheck, Database, Layers, CheckCircle2 } from 'lucide-react';

export default function Settings({ onClose }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-3.5 sm:p-4 fade-in"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="w-full max-w-xl bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50 flex-shrink-0">
          <div className="flex items-center gap-2">
            <ShieldCheck size={18} className="text-teal-700" />
            <h2 className="text-base font-bold text-slate-900">Platform Architecture & Data Sources</h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="w-8 h-8 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs sm:text-sm">
          {/* Project Summary */}
          <section>
            <h3 className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-2">
              Smart India Hackathon Innovation
            </h3>
            <div className="p-4 rounded-xl bg-teal-50/60 border border-teal-200">
              <div className="flex items-center gap-2.5 mb-2">
                <div className="w-8 h-8 rounded-lg bg-teal-700 text-white flex items-center justify-center font-bold">
                  WW
                </div>
                <div>
                  <p className="font-bold text-slate-900">WeatherWise</p>
                  <p className="text-xs text-teal-800 font-medium">Environmental Decision Intelligence Platform v2.0</p>
                </div>
              </div>
              <p className="text-slate-700 text-xs leading-relaxed">
                WeatherWise fuses real-time meteorological metrics with multi-pollutant Air Quality Telemetry to power an automated Decision Support Engine tailored for 8 domain-specific stakeholder personas.
              </p>
            </div>
          </section>

          {/* Live Data Sources */}
          <section>
            <h3 className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-2.5">
              Live Environmental Telemetry Feeds
            </h3>
            <div className="space-y-2">
              {[
                { name: 'Meteorological & 7-Day Forecast', source: 'Open-Meteo High-Resolution NWP API', protocol: 'REST / JSON' },
                { name: 'Atmospheric Air Quality & Pollutants (AQI, PM2.5, PM10, O3, NO2)', source: 'Copernicus Atmosphere Service (CAMS) via Open-Meteo', protocol: 'REST / Continuous' },
                { name: 'Global Geocoding & Regional Telemetry Stations', source: 'Open-Meteo Geocoding Engine', protocol: 'Geospatial Index' },
                { name: 'Reverse Spatial Geocoding', source: 'OpenStreetMap Nominatim Engine', protocol: 'Spatial Lat/Lon' },
              ].map((item) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between gap-3 p-3 rounded-lg bg-slate-50 border border-slate-200"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-slate-900 break-words">{item.name}</p>
                    <p className="text-[11px] text-slate-500 break-words">{item.source}</p>
                  </div>
                  <span className="text-[10px] font-bold text-teal-800 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded-md flex-shrink-0">
                    {item.protocol}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Technology Architecture */}
          <section>
            <h3 className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-2">
              Full-Stack System Architecture
            </h3>
            <div className="flex flex-wrap gap-2">
              {['FastAPI Microservice', 'Python 3.11', 'React 18', 'Vite 8', 'Tailwind CSS', 'Recharts Telemetry', 'SQLite / PostgreSQL', 'CORS Security Regex'].map((tech) => (
                <span
                  key={tech}
                  className="text-xs font-medium text-slate-700 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-md"
                >
                  {tech}
                </span>
              ))}
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-200 flex justify-end bg-slate-50 flex-shrink-0">
          <button className="btn-primary" onClick={onClose}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
