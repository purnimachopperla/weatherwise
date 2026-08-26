/**
 * recommendationUtils.js — Profile metadata for the frontend.
 *
 * Contains the labels, icons, and descriptions for each user profile
 * used in the ProfileSelector and recommendation display.
 */

export const PROFILES = [
  {
    key: 'health',
    label: 'Health',
    fullLabel: 'Health-Conscious',
    emoji: '🏥',
    description: 'AQI, UV & wellness advice',
    color: '#10b981',
  },
  {
    key: 'fitness',
    label: 'Fitness',
    fullLabel: 'Outdoor Fitness',
    emoji: '🏃',
    description: 'Best workout time & conditions',
    color: '#6366f1',
  },
  {
    key: 'travel',
    label: 'Travel',
    fullLabel: 'Traveler',
    emoji: '✈️',
    description: 'Travel safety & packing tips',
    color: '#06b6d4',
  },
  {
    key: 'family',
    label: 'Family',
    fullLabel: 'Parent / Family',
    emoji: '👨‍👩‍👧',
    description: 'Kids safety & school commute',
    color: '#f59e0b',
  },
  {
    key: 'agriculture',
    label: 'Farming',
    fullLabel: 'Farmer / Gardener',
    emoji: '🌾',
    description: 'Crop care & irrigation advice',
    color: '#84cc16',
  },
  {
    key: 'commuter',
    label: 'Commuter',
    fullLabel: 'Commuter',
    emoji: '🚗',
    description: 'Road conditions & commute tips',
    color: '#8b5cf6',
  },
  {
    key: 'beach',
    label: 'Beach',
    fullLabel: 'Beach / Surfer',
    emoji: '🏄',
    description: 'Beach & surf conditions',
    color: '#0ea5e9',
  },
  {
    key: 'event',
    label: 'Events',
    fullLabel: 'Event Planner',
    emoji: '🎉',
    description: 'Outdoor event planning',
    color: '#ec4899',
  },
];

export function getProfileByKey(key) {
  return PROFILES.find((p) => p.key === key) || PROFILES[0];
}
