import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorBannerProps {
  message: string;
  onRetry: () => void;
}

export const ErrorBanner: React.FC<ErrorBannerProps> = ({ message, onRetry }) => {
  return (
    <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 flex items-center justify-between gap-3 backdrop-blur-xl mb-6">
      <div className="flex items-center gap-2.5">
        <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />
        <span className="text-xs sm:text-sm font-medium">{message}</span>
      </div>
      <button
        onClick={onRetry}
        className="px-3 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-xs font-semibold text-rose-200 transition-colors flex items-center gap-1.5 flex-shrink-0 cursor-pointer"
      >
        <RefreshCw className="w-3.5 h-3.5" />
        <span>Retry</span>
      </button>
    </div>
  );
};
