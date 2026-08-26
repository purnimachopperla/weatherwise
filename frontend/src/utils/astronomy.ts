export interface SunOrbitTelemetry {
  sunPositionPercent: number; // 0 to 100
  isDaytime: boolean;
  sunriseTime: string;
  sunsetTime: string;
  solarNoon: string;
  goldenHourMorning: string;
  goldenHourEvening: string;
  civilTwilightDawn: string;
  civilTwilightDusk: string;
  timeUntilSunset: string;
  timeUntilSunrise: string;
}

export interface MoonPhaseInfo {
  phaseName: string;
  illumination: number; // 0 to 100%
  ageDays: number;
  stage: 'new' | 'waxing_crescent' | 'first_quarter' | 'waxing_gibbous' | 'full' | 'waning_gibbous' | 'last_quarter' | 'waning_crescent';
}

// Convert "06:01 AM" or "06:33 PM" to minutes from midnight
const parseTimeToMinutes = (timeStr: string): number => {
  if (!timeStr || timeStr === 'N/A') return 360; // 6 AM fallback
  const parts = timeStr.trim().split(' ');
  const [hStr, mStr] = parts[0].split(':');
  let hour = parseInt(hStr, 10);
  const min = parseInt(mStr, 10);
  const ampm = parts[1]?.toUpperCase() || 'AM';

  if (ampm === 'PM' && hour < 12) hour += 12;
  if (ampm === 'AM' && hour === 12) hour = 0;

  return hour * 60 + min;
};

const formatMinutesToTime = (totalMinutes: number): string => {
  const normalized = (totalMinutes + 1440) % 1440;
  const hour = Math.floor(normalized / 60);
  const min = normalized % 60;
  const h12 = hour % 12 || 12;
  const ampm = hour >= 12 ? 'PM' : 'AM';
  return `${h12 < 10 ? '0' : ''}${h12}:${min < 10 ? '0' : ''}${min} ${ampm}`;
};

export const calculateSunOrbit = (
  sunriseStr = '06:00 AM',
  sunsetStr = '06:30 PM'
): SunOrbitTelemetry => {
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const sunriseMin = parseTimeToMinutes(sunriseStr);
  const sunsetMin = parseTimeToMinutes(sunsetStr);

  const isDaytime = currentMinutes >= sunriseMin && currentMinutes <= sunsetMin;

  let sunPositionPercent = 0;
  if (isDaytime) {
    const totalDaylightMin = sunsetMin - sunriseMin || 1;
    sunPositionPercent = Math.min(100, Math.max(0, ((currentMinutes - sunriseMin) / totalDaylightMin) * 100));
  } else {
    // Night path
    if (currentMinutes > sunsetMin) {
      const nightElapsed = currentMinutes - sunsetMin;
      const totalNight = (1440 - sunsetMin) + sunriseMin;
      sunPositionPercent = (nightElapsed / totalNight) * 100;
    } else {
      const nightElapsed = (1440 - sunsetMin) + currentMinutes;
      const totalNight = (1440 - sunsetMin) + sunriseMin;
      sunPositionPercent = (nightElapsed / totalNight) * 100;
    }
  }

  // Solar events
  const solarNoonMin = Math.round((sunriseMin + sunsetMin) / 2);
  const goldenHourMorning = `${formatMinutesToTime(sunriseMin)} – ${formatMinutesToTime(sunriseMin + 60)}`;
  const goldenHourEvening = `${formatMinutesToTime(sunsetMin - 60)} – ${formatMinutesToTime(sunsetMin)}`;
  const civilTwilightDawn = formatMinutesToTime(sunriseMin - 30);
  const civilTwilightDusk = formatMinutesToTime(sunsetMin + 30);

  // Countdowns
  let timeUntilSunset = 'Passed';
  if (currentMinutes < sunsetMin) {
    const diff = sunsetMin - currentMinutes;
    const h = Math.floor(diff / 60);
    const m = diff % 60;
    timeUntilSunset = `${h > 0 ? `${h}h ` : ''}${m}m left`;
  }

  let timeUntilSunrise = 'Active';
  if (!isDaytime) {
    let diff = 0;
    if (currentMinutes > sunsetMin) {
      diff = (1440 - currentMinutes) + sunriseMin;
    } else {
      diff = sunriseMin - currentMinutes;
    }
    const h = Math.floor(diff / 60);
    const m = diff % 60;
    timeUntilSunrise = `in ${h > 0 ? `${h}h ` : ''}${m}m`;
  }

  return {
    sunPositionPercent: Math.round(sunPositionPercent),
    isDaytime,
    sunriseTime: sunriseStr,
    sunsetTime: sunsetStr,
    solarNoon: formatMinutesToTime(solarNoonMin),
    goldenHourMorning,
    goldenHourEvening,
    civilTwilightDawn,
    civilTwilightDusk,
    timeUntilSunset,
    timeUntilSunrise,
  };
};

export const calculateMoonPhase = (date = new Date()): MoonPhaseInfo => {
  // Known reference new moon: Jan 11, 2024
  const refNewMoon = new Date(Date.UTC(2024, 0, 11, 11, 57));
  const synodicMonth = 29.53058867;
  const diffDays = (date.getTime() - refNewMoon.getTime()) / (1000 * 60 * 60 * 24);
  const ageDays = ((diffDays % synodicMonth) + synodicMonth) % synodicMonth;

  // Illumination calculation (0 to 100%)
  const illumination = Math.round(((1 - Math.cos((ageDays / synodicMonth) * 2 * Math.PI)) / 2) * 100);

  let phaseName = 'New Moon';
  let stage: MoonPhaseInfo['stage'] = 'new';

  if (ageDays < 1.845) {
    phaseName = 'New Moon';
    stage = 'new';
  } else if (ageDays < 5.536) {
    phaseName = 'Waxing Crescent';
    stage = 'waxing_crescent';
  } else if (ageDays < 9.228) {
    phaseName = 'First Quarter';
    stage = 'first_quarter';
  } else if (ageDays < 12.919) {
    phaseName = 'Waxing Gibbous';
    stage = 'waxing_gibbous';
  } else if (ageDays < 16.61) {
    phaseName = 'Full Moon';
    stage = 'full';
  } else if (ageDays < 20.302) {
    phaseName = 'Waning Gibbous';
    stage = 'waning_gibbous';
  } else if (ageDays < 23.993) {
    phaseName = 'Last Quarter';
    stage = 'last_quarter';
  } else if (ageDays < 27.684) {
    phaseName = 'Waning Crescent';
    stage = 'waning_crescent';
  } else {
    phaseName = 'New Moon';
    stage = 'new';
  }

  return {
    phaseName,
    illumination,
    ageDays: Math.round(ageDays * 10) / 10,
    stage,
  };
};
