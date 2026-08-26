/**
 * ErrorState.jsx — Friendly error display component.
 *
 * Shown when the API fails, the city is not found,
 * or there's a network error. Never shows a blank screen.
 */

import { AlertCircle, RefreshCw, Search } from 'lucide-react';

export default function ErrorState({ message, onRetry, onSearch }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-64 p-8 text-center fade-in">
      {/* Error Icon */}
      <div
        className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
        style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)' }}
      >
        <AlertCircle size={36} style={{ color: '#ef4444' }} />
      </div>

      {/* Error Title */}
      <h2
        className="text-2xl font-bold mb-3"
        style={{ color: '#f1f5f9' }}
      >
        Something went wrong
      </h2>

      {/* Error Message */}
      <p
        className="text-base mb-8 max-w-md leading-relaxed"
        style={{ color: '#94a3b8' }}
      >
        {message || 'Weather service is temporarily unavailable. Please try again.'}
      </p>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 justify-center">
        {onRetry && (
          <button className="btn-primary" onClick={onRetry}>
            <RefreshCw size={16} />
            Try Again
          </button>
        )}
        {onSearch && (
          <button className="btn-secondary" onClick={onSearch}>
            <Search size={16} />
            Search a City
          </button>
        )}
      </div>

      {/* Helpful Tips */}
      <div
        className="mt-8 p-4 rounded-xl text-sm text-left max-w-sm"
        style={{ background: 'rgba(99,102,241,0.05)', border: '1px solid rgba(99,102,241,0.15)' }}
      >
        <p className="font-semibold mb-2" style={{ color: '#94a3b8' }}>💡 Troubleshooting</p>
        <ul className="space-y-1" style={{ color: '#64748b' }}>
          <li>• Check your internet connection</li>
          <li>• Make sure the backend is running on port 8000</li>
          <li>• Try searching for a different city</li>
        </ul>
      </div>
    </div>
  );
}
