/**
 * App.jsx — Root application component.
 *
 * Manages top-level state (like the settings modal)
 * and renders the Dashboard page.
 */

import { useState } from 'react';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';

export default function App() {
  const [showSettings, setShowSettings] = useState(false);

  return (
    <>
      {/* Main dashboard */}
      <Dashboard onOpenSettings={() => setShowSettings(true)} />

      {/* Settings modal (rendered on top when open) */}
      {showSettings && (
        <Settings onClose={() => setShowSettings(false)} />
      )}
    </>
  );
}
