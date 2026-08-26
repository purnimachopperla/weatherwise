/**
 * ErrorState.jsx — Professional Environmental Telemetry Error & Rate Limit Handler.
 *
 * Distinguishes between:
 * 1. Provider Rate Limits (HTTP 429) — High global telemetry demand
 * 2. Gateway/Network Connectivity Interruption
 */

import { AlertTriangle, Clock, RefreshCw, Search, ShieldAlert, WifiOff } from 'lucide-react';

export default function ErrorState({ message, onRetry, onSearch }) {
  const isRateLimited =
    typeof message === 'string' &&
    (message.toLowerCase().includes('rate-limit') ||
      message.toLowerCase().includes('too many requests') ||
      message.includes('429'));

  return (
    <div className="panel-card p-7 sm:p-10 text-center bg-white border border-slate-200 fade-in my-6 max-w-2xl mx-auto shadow-sm">
      {/* Dynamic Status Icon */}
      <div
        className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 border ${
          isRateLimited
            ? 'bg-amber-50 border-amber-200 text-amber-700'
            : 'bg-rose-50 border-rose-200 text-rose-600'
        }`}
      >
        {isRateLimited ? <Clock size={28} /> : <WifiOff size={28} />}
      </div>

      {/* Heading */}
      <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-2">
        {isRateLimited
          ? 'Telemetry Provider Demand Limit'
          : 'Telemetry Link Temporarily Unavailable'}
      </h2>

      {/* Description */}
      <p className="text-xs sm:text-sm text-slate-600 mb-6 max-w-md mx-auto leading-relaxed">
        {isRateLimited
          ? 'The upstream Open-Meteo environmental telemetry service is experiencing peak query volume. Server-side caching will automatically serve subsequent requests once refreshed.'
          : message || 'Unable to establish real-time telemetry link. Please verify connection and retry.'}
      </p>

      {/* Action Controls */}
      <div className="flex flex-wrap gap-2.5 justify-center mb-6">
        {onRetry && (
          <button className="btn-primary" onClick={onRetry}>
            <RefreshCw size={14} />
            <span>Retry Telemetry Sync</span>
          </button>
        )}
        {onSearch && (
          <button className="btn-secondary" onClick={onSearch}>
            <Search size={14} />
            <span>Query Cached Station</span>
          </button>
        )}
      </div>

      {/* Enterprise Troubleshooting Guidance */}
      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-left max-w-md mx-auto">
        <p className="font-bold text-slate-800 mb-1.5 flex items-center gap-1.5">
          <ShieldAlert size={14} className="text-teal-700" />
          <span>System Advisory:</span>
        </p>
        <ul className="space-y-1 text-slate-600 text-[11px]">
          {isRateLimited ? (
            <>
              <li>• Automated 10-minute caching is active on the WeatherWise gateway.</li>
              <li>• Existing cached stations will load immediately without hitting upstream limits.</li>
              <li>• Click "Retry Telemetry Sync" after a few moments.</li>
            </>
          ) : (
            <>
              <li>• Verify device network connectivity and DNS resolution.</li>
              <li>• Check that the WeatherWise backend service is operational.</li>
              <li>• Try querying an alternate regional station.</li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
}
