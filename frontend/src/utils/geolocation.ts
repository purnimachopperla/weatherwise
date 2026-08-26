import { reverseGeocode } from '../services/api';

export interface DetectedLocation {
  name: string;
  country: string;
  latitude: number;
  longitude: number;
  source: 'gps' | 'ip' | 'fallback';
}

/**
 * Detect the user's live physical location with automatic multi-tier fallback:
 * 1. High-accuracy Browser GPS (navigator.geolocation)
 * 2. IP-based Geolocation (ipapi.co / freeipapi.com)
 * 3. Reverse geocode coordinates via backend Open-Meteo
 */
export const detectLiveLocation = async (): Promise<DetectedLocation> => {
  // 1. Try Browser GPS first
  if (navigator.geolocation) {
    try {
      const gpsResult = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 6000,
          maximumAge: 60000,
        });
      });

      const { latitude, longitude } = gpsResult.coords;
      try {
        const rev = await reverseGeocode(latitude, longitude);
        return {
          name: rev.name || 'Current Location',
          country: rev.country || '',
          latitude,
          longitude,
          source: 'gps',
        };
      } catch {
        return {
          name: 'Current Location',
          country: '',
          latitude,
          longitude,
          source: 'gps',
        };
      }
    } catch (gpsError) {
      console.info('[Geo] Browser GPS unavailable or denied, switching to IP Geolocation...', gpsError);
    }
  }

  // 2. Fallback to IP Geolocation Provider 1 (ipapi.co)
  try {
    const res = await fetch('https://ipapi.co/json/', { signal: AbortSignal.timeout(4000) });
    if (res.ok) {
      const data = await res.json();
      if (data.latitude && data.longitude) {
        return {
          name: data.city || data.region || 'Current Location',
          country: data.country_name || data.country || '',
          latitude: parseFloat(data.latitude),
          longitude: parseFloat(data.longitude),
          source: 'ip',
        };
      }
    }
  } catch (err) {
    console.warn('[Geo] IP provider 1 failed, trying provider 2...', err);
  }

  // 3. Fallback to IP Geolocation Provider 2 (freeipapi.com)
  try {
    const res = await fetch('https://freeipapi.com/api/json', { signal: AbortSignal.timeout(4000) });
    if (res.ok) {
      const data = await res.json();
      if (data.latitude && data.longitude) {
        return {
          name: data.cityName || 'Current Location',
          country: data.countryName || '',
          latitude: parseFloat(data.latitude),
          longitude: parseFloat(data.longitude),
          source: 'ip',
        };
      }
    }
  } catch (err) {
    console.warn('[Geo] IP provider 2 failed', err);
  }

  // 4. Fallback Default (e.g. London / New York)
  return {
    name: 'London',
    country: 'United Kingdom',
    latitude: 51.5074,
    longitude: -0.1278,
    source: 'fallback',
  };
};
