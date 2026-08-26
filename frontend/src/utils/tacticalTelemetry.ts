import { forward } from 'mgrs';

export interface TacticalData {
  mgrs: string;
  altitudeFt: number;
  groundSpeedKts: number;
  bearingDeg: number;
  satPassTime: string;
  satOrbitId: string;
  securityZone: string;
}

export const getTacticalTelemetry = (
  latitude: number,
  longitude: number,
  windSpeed = 10,
  windDirection = 270
): TacticalData => {
  let mgrsString = 'GRID_OFFLINE';
  try {
    // mgrs forward expects [longitude, latitude]
    mgrsString = forward([longitude, latitude], 4);
  } catch (err) {
    console.warn('MGRS calculation error', err);
    mgrsString = `${Math.abs(latitude).toFixed(2)}${latitude >= 0 ? 'N' : 'S'} ${Math.abs(longitude).toFixed(2)}${longitude >= 0 ? 'E' : 'W'}`;
  }

  // Generate tactical satellite orbital passes & telemetry based on coordinates
  const now = new Date();
  const nextPassMin = Math.round(((Math.abs(latitude * 11 + longitude * 7) % 45) + 12));
  const passDate = new Date(now.getTime() + nextPassMin * 60000);
  const satPassTime = passDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const satIdNumber = Math.round(Math.abs(latitude * 100 + longitude * 10)) % 900 + 100;
  const satOrbitId = `NOAA-${(satIdNumber % 10) + 18} / METEOSAT-${(satIdNumber % 5) + 1}`;

  return {
    mgrs: mgrsString,
    altitudeFt: Math.round(180 + (Math.abs(latitude * 13) % 420)),
    groundSpeedKts: Math.round(windSpeed * 0.539957),
    bearingDeg: Math.round(windDirection),
    satPassTime,
    satOrbitId,
    securityZone: `GRID-${mgrsString.slice(0, 3)}`,
  };
};

export interface UsgsEarthquake {
  id: string;
  mag: number;
  place: string;
  time: number;
  coordinates: [number, number, number]; // [lon, lat, depth]
}

export const fetchLiveEarthquakes = async (): Promise<UsgsEarthquake[]> => {
  try {
    const res = await fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_day.geojson', {
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return [];
    const data = await res.json();
    return (data.features || []).slice(0, 40).map((f: { id: string; properties: { mag: number; place: string; time: number }; geometry: { coordinates: [number, number, number] } }) => ({
      id: f.id,
      mag: f.properties.mag,
      place: f.properties.place,
      time: f.properties.time,
      coordinates: f.geometry.coordinates,
    }));
  } catch (err) {
    console.warn('[USGS] Could not fetch live earthquakes', err);
    return [];
  }
};
