/**
 * ErrorState.jsx — Professional error state display with diagnostic guidance.
 */

import { AlertTriangle, RefreshCw, Search } from 'lucide-react';

export default function ErrorState({ message, onRetry, onSearch }) {
  return (
    <div className="panel-card p-8 sm:p-12 text-center bg-white border border-slate-200 fade-in my-6 max-w-2xl mx-auto">
      {/* Error Icon */}
      <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto mb-4">
        <AlertTriangle size={30} />
      </div>

      {/* Error Title */}
      <h2 className="text-xl font-bold text-slate-900 mb-2">
        Telemetry Link Interrupted
      </h2>

      {/* Error Message */}
      <p className="text-sm text-slate-600 mb-6 max-w-md mx-auto leading-relaxed">
        {message || 'Unable to retrieve meteorological and environmental telemetry. Please verify connection and retry.'}
      </p>

      {/* Actions */}
      <div className="flex flex-wrap gap-3 justify-center mb-8">
        {onRetry && (
          <button className="btn-primary" onClick={onRetry}>
            <RefreshCw size={15} />
            <span>Reconnect & Retry</span>
          </button>
        )}
        {onSearch && (
          <button className="btn-secondary" onClick={onSearch}>
            <Search size={15} />
            <span>Search Different Station</span>
          </button>
        )}
      </div>

      {/* Diagnostic Details */}
      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-left max-w-md mx-auto">
        <p className="font-bold text-slate-800 mb-2">Diagnostic Checklist:</p>
        <ul className="space-y-1.5 text-slate-600">
          <li>• Verify Internet connectivity or API gateway status</li>
          <li>• Ensure backend service is reachable on port 8000</li>
          <li>• Try searching for a major metropolitan station (e.g. Hyderabad, Delhi)</li>
        </ul>
      </div>
    </div>
  );
}
