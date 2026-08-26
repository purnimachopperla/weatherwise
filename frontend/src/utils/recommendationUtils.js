/**
 * recommendationUtils.js — Professional Persona Profiles for Environmental Intelligence.
 *
 * Provides metadata and Lucide icon keys for the 8 lifestyle personas.
 */

export const PROFILES = [
  {
    key: 'health',
    label: 'Health & Wellness',
    fullLabel: 'Health-Conscious Individuals',
    icon: 'Heart',
    description: 'AQI sensitivity, allergen exposure & respiratory advisory',
    confidence: '98%',
  },
  {
    key: 'fitness',
    label: 'Athletics & Training',
    fullLabel: 'Outdoor Runners & Athletes',
    icon: 'Activity',
    description: 'Thermal load, hydration windows & optimal cardio timing',
    confidence: '95%',
  },
  {
    key: 'family',
    label: 'Family & Children',
    fullLabel: 'Parents & School Commute',
    icon: 'Users',
    description: 'Child thermal comfort, UV protection & playground readiness',
    confidence: '94%',
  },
  {
    key: 'commuter',
    label: 'Daily Commute',
    fullLabel: 'Urban Commuters & Drivers',
    icon: 'Car',
    description: 'Road visibility, precipitation risks & route safety',
    confidence: '96%',
  },
  {
    key: 'agriculture',
    label: 'Agriculture & Farms',
    fullLabel: 'Farmers & Agronomists',
    icon: 'Sprout',
    description: 'Evapotranspiration, soil moisture & spray window recommendations',
    confidence: '97%',
  },
  {
    key: 'travel',
    label: 'Transit & Travel',
    fullLabel: 'Domestic & Global Travelers',
    icon: 'Plane',
    description: 'Travel advisory, luggage gear & transit disruption alerts',
    confidence: '92%',
  },
  {
    key: 'beach',
    label: 'Coastal & Marine',
    fullLabel: 'Coastal & Maritime Activities',
    icon: 'Waves',
    description: 'Wave dynamics, UV radiation & coastal wind alerts',
    confidence: '93%',
  },
  {
    key: 'event',
    label: 'Public Events',
    fullLabel: 'Event Planners & Venues',
    icon: 'CalendarCheck',
    description: 'Outdoor venue safety, crowd thermal stress & shelter requirements',
    confidence: '95%',
  },
];

export function getProfileByKey(key) {
  return PROFILES.find((p) => p.key === key) || PROFILES[0];
}
