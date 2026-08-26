import React, { useState, useEffect, useMemo, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle } from 'react-leaflet';
import L from 'leaflet';
import {
  CloudRain,
  Maximize2,
  Minimize2,
  Satellite,
  Activity,
  Plus,
  Minus,
  LocateFixed,
  Compass,
} from 'lucide-react';
import { getTacticalTelemetry, fetchLiveEarthquakes } from '../utils/tacticalTelemetry';
import type { UsgsEarthquake } from '../utils/tacticalTelemetry';
import { GodsEyeHUD } from './GodsEyeHUD';
import type { VisionMode } from './GodsEyeHUD';

interface WeatherRadarMapProps {
  latitude: number;
  longitude: number;
  locationName: string;
  temperature: number;
  windSpeed?: number;
  windDirection?: number;
}

type RadarLayerType = 'radar' | 'temp' | 'earthquakes';
type BasemapType = 'satellite' | 'dark' | 'osm' | 'topo';

// Custom pulsing pin
const customPinIcon = L.divIcon({
  className: 'custom-leaflet-marker',
  html: `<div style="position:relative;display:flex;align-items:center;justify-content:center;width:26px;height:26px;">
    <span style="position:absolute;width:100%;height:100%;border-radius:50%;background:rgba(6,182,212,0.45);animation:ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></span>
    <span style="position:relative;width:12px;height:12px;border-radius:50%;background:#06b6d4;border:2px solid #ffffff;box-shadow:0 0 12px #06b6d4;"></span>
  </div>`,
  iconSize: [26, 26],
  iconAnchor: [13, 13],
});

// Earthquake pin icon
const createEarthquakeIcon = (mag: number) =>
  L.divIcon({
    className: 'custom-quake-marker',
    html: `<div style="width:20px;height:20px;border-radius:50%;background:rgba(244,63,94,0.3);border:2px solid #f43f5e;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:bold;color:#ffffff;box-shadow:0 0 10px #f43f5e;">
      ${mag.toFixed(1)}
    </div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });

// Map controller for programmatic view & zoom
const MapController: React.FC<{
  center: [number, number];
  zoom: number;
  onMapReady?: (map: L.Map) => void;
}> = ({ center, zoom, onMapReady }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom, { animate: true });
    if (onMapReady) onMapReady(map);
  }, [center, zoom, map, onMapReady]);
  return null;
};

export const WeatherRadarMap: React.FC<WeatherRadarMapProps> = ({
  latitude,
  longitude,
  locationName,
  temperature,
  windSpeed = 10,
  windDirection = 270,
}) => {
  const [activeLayer, setActiveLayer] = useState<RadarLayerType>('radar');
  const [basemap, setBasemap] = useState<BasemapType>('satellite');
  const [isGodsEyeMode, setIsGodsEyeMode] = useState<boolean>(true);
  const [visionMode, setVisionMode] = useState<VisionMode>('cyan');
  const [radarTimestamp, setRadarTimestamp] = useState<number | null>(null);
  const [earthquakes, setEarthquakes] = useState<UsgsEarthquake[]>([]);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const mapInstanceRef = useRef<L.Map | null>(null);

  // Fetch RainViewer radar timestamp
  useEffect(() => {
    const fetchRadar = async () => {
      try {
        const res = await fetch('https://api.rainviewer.com/public/weather-maps.json');
        if (res.ok) {
          const data = await res.json();
          const past = data.radar?.past;
          if (past && past.length > 0) {
            setRadarTimestamp(past[past.length - 1].time);
          }
        }
      } catch (err) {
        console.warn('Could not load RainViewer timestamp', err);
      }
    };
    fetchRadar();
  }, []);

  // Fetch live USGS earthquakes
  useEffect(() => {
    const loadQuakes = async () => {
      const data = await fetchLiveEarthquakes();
      setEarthquakes(data);
    };
    loadQuakes();
  }, []);

  const tactical = useMemo(
    () => getTacticalTelemetry(latitude, longitude, windSpeed, windDirection),
    [latitude, longitude, windSpeed, windDirection]
  );

  const position: [number, number] = [latitude, longitude];

  // 100% Free, Keyless, High-Resolution Basemaps
  const getBasemapConfig = () => {
    switch (basemap) {
      case 'dark':
        return {
          url: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}',
          maxNativeZoom: 16,
          maxZoom: 19,
          attribution: '&copy; ESRI Dark Canvas',
        };
      case 'osm':
        return {
          url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
          maxNativeZoom: 19,
          maxZoom: 19,
          attribution: '&copy; OpenStreetMap contributors',
        };
      case 'topo':
        return {
          url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
          maxNativeZoom: 16,
          maxZoom: 19,
          attribution: '&copy; OpenTopoMap',
        };
      default:
        // High-Resolution World Satellite (Clamped to maxNativeZoom: 16 so no "Zoom Level Not Supported" tiles appear)
        return {
          url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
          maxNativeZoom: 16,
          maxZoom: 19,
          attribution: '&copy; ESRI World Satellite',
        };
    }
  };

  const currentBasemap = getBasemapConfig();

  const handleZoomIn = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomIn();
    }
  };

  const handleZoomOut = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomOut();
    }
  };

  const handleRecenter = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView(position, 8, { animate: true });
    }
  };

  return (
    <div
      className={`p-6 rounded-2xl glass-card border border-white/10 relative transition-all duration-300 ${
        isFullscreen ? 'fixed inset-4 z-50 p-6 flex flex-col justify-between' : ''
      }`}
    >
      {/* Map Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
            <Satellite className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-display text-base font-bold text-white">
                God's Eye View • Planetary Telemetry & Radar
              </h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                GEV-v1.0
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Keyless satellite imagery, live precipitation radar & global seismic feeds
            </p>
          </div>
        </div>

        {/* Action Controls & Layer Switcher */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* God's Eye HUD Toggle */}
          <button
            onClick={() => setIsGodsEyeMode(!isGodsEyeMode)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono transition-all flex items-center gap-1.5 cursor-pointer ${
              isGodsEyeMode
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-glow-cyan'
                : 'bg-dark-900 border border-white/10 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>{isGodsEyeMode ? 'HUD ON' : 'HUD OFF'}</span>
          </button>

          {/* Basemap Switcher (100% Free & Keyless) */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-dark-900 border border-white/5 text-xs">
            <button
              onClick={() => setBasemap('satellite')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                basemap === 'satellite' ? 'bg-white/20 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Satellite
            </button>
            <button
              onClick={() => setBasemap('dark')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                basemap === 'dark' ? 'bg-white/20 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Dark Grid
            </button>
            <button
              onClick={() => setBasemap('osm')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                basemap === 'osm' ? 'bg-white/20 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              OSM
            </button>
            <button
              onClick={() => setBasemap('topo')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                basemap === 'topo' ? 'bg-white/20 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Terrain
            </button>
          </div>

          {/* Layers Group */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-dark-900 border border-white/5 text-xs">
            <button
              onClick={() => setActiveLayer('radar')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                activeLayer === 'radar'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <CloudRain className="w-3.5 h-3.5" />
              <span>Radar</span>
            </button>

            <button
              onClick={() => setActiveLayer('earthquakes')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                activeLayer === 'earthquakes'
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Quakes</span>
            </button>
          </div>

          {/* Fullscreen Button */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            title={isFullscreen ? 'Exit Fullscreen' : 'Expand Tactical Radar'}
            className="p-2 rounded-xl bg-dark-900 border border-white/10 text-slate-300 hover:text-white hover:border-white/20 transition-all cursor-pointer"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Map View Container with Tactical Overlay */}
      <div className={`w-full rounded-xl overflow-hidden border border-white/10 relative ${isFullscreen ? 'flex-1 min-h-[520px]' : 'h-96'}`}>
        {/* God's Eye Tactical HUD */}
        {isGodsEyeMode && (
          <GodsEyeHUD
            tactical={tactical}
            visionMode={visionMode}
            onSelectVisionMode={setVisionMode}
            locationName={locationName}
            latitude={latitude}
            longitude={longitude}
            temperature={temperature}
          />
        )}

        {/* Custom Clean Map Zoom & Navigation Controls */}
        <div className="absolute right-4 bottom-4 z-[460] flex flex-col gap-1.5 pointer-events-auto">
          <button
            onClick={handleZoomIn}
            title="Zoom In"
            className="p-2 rounded-xl bg-dark-950/85 backdrop-blur-xl border border-white/15 text-slate-200 hover:text-white hover:border-white/30 shadow-xl transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            onClick={handleZoomOut}
            title="Zoom Out"
            className="p-2 rounded-xl bg-dark-950/85 backdrop-blur-xl border border-white/15 text-slate-200 hover:text-white hover:border-white/30 shadow-xl transition-all cursor-pointer"
          >
            <Minus className="w-4 h-4" />
          </button>
          <button
            onClick={handleRecenter}
            title="Lock Target Center"
            className="p-2 rounded-xl bg-cyan-500/20 backdrop-blur-xl border border-cyan-500/40 text-cyan-300 hover:text-white shadow-xl transition-all cursor-pointer"
          >
            <LocateFixed className="w-4 h-4" />
          </button>
        </div>

        <MapContainer
          center={position}
          zoom={8}
          minZoom={2}
          maxZoom={19}
          zoomControl={false}
          scrollWheelZoom={true}
          className="w-full h-full"
        >
          <MapController
            center={position}
            zoom={8}
            onMapReady={(map) => {
              mapInstanceRef.current = map;
            }}
          />

          {/* Dynamic 100% Keyless Basemap */}
          <TileLayer
            key={basemap}
            url={currentBasemap.url}
            attribution={currentBasemap.attribution}
            maxNativeZoom={currentBasemap.maxNativeZoom}
            maxZoom={19}
          />

          {/* Live RainViewer Precipitation Radar Overlay with maxNativeZoom=6 to prevent watermark tiles */}
          {activeLayer === 'radar' && radarTimestamp && (
            <TileLayer
              key={radarTimestamp}
              url={`https://tilecache.rainviewer.com/v2/radar/${radarTimestamp}/256/{z}/{x}/{y}/2/1_1.png`}
              opacity={0.85}
              minZoom={1}
              maxNativeZoom={6}
              maxZoom={19}
            />
          )}

          {/* Thermal overlay with maxNativeZoom=6 */}
          {activeLayer === 'temp' && (
            <TileLayer
              url="https://tilecache.rainviewer.com/v2/coverage/256/{z}/{x}/{y}/0/0_0.png"
              opacity={0.7}
              minZoom={1}
              maxNativeZoom={6}
              maxZoom={19}
            />
          )}

          {/* Target Radius Circle */}
          <Circle
            center={position}
            radius={25000}
            pathOptions={{
              color: '#06b6d4',
              fillColor: '#06b6d4',
              fillOpacity: 0.12,
              weight: 1.5,
              dashArray: '4 4',
            }}
          />

          {/* Active Target Pin */}
          <Marker position={position} icon={customPinIcon}>
            <Popup>
              <div className="p-1 text-center font-sans text-xs font-mono">
                <div className="font-bold text-slate-100">{locationName}</div>
                <div className="text-cyan-400 font-semibold mt-0.5">
                  {temperature.toFixed(1)}°C
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  MGRS: {tactical.mgrs}
                </div>
              </div>
            </Popup>
          </Marker>

          {/* Real-Time Live USGS Earthquakes Layer */}
          {activeLayer === 'earthquakes' &&
            earthquakes.map((q) => (
              <Marker
                key={q.id}
                position={[q.coordinates[1], q.coordinates[0]]}
                icon={createEarthquakeIcon(q.mag)}
              >
                <Popup>
                  <div className="p-1 text-xs font-mono text-slate-200">
                    <div className="font-bold text-rose-400">Magnitude {q.mag}</div>
                    <div className="text-slate-300">{q.place}</div>
                    <div className="text-[10px] text-slate-400 mt-1">
                      {new Date(q.time).toLocaleString()}
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
        </MapContainer>
      </div>
    </div>
  );
};
