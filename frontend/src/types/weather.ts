export type UserProfile =
  | 'health'
  | 'fitness'
  | 'travel'
  | 'family'
  | 'agriculture'
  | 'commuter'
  | 'beach'
  | 'event';

export type TemperatureUnit = 'celsius' | 'fahrenheit';

export interface CurrentWeather {
  temperature: number;
  feels_like: number;
  humidity: number;
  wind_speed: number;
  wind_direction?: number;
  surface_pressure?: number;
  pressure?: number;
  visibility?: number;
  weather_code: number;
  condition?: string;
  weather_condition?: string;
  icon?: string;
  weather_icon?: string;
  is_day?: number;
}

export interface HourlyForecastItem {
  time: string;
  hour?: string;
  temperature: number;
  humidity: number;
  rain_probability: number;
  weather_code: number;
  wind_speed: number;
}

export interface DailyForecastItem {
  date: string;
  day_name: string;
  temp_max: number;
  temp_min: number;
  rain_probability: number;
  weather_code: number;
  sunrise: string;
  sunset: string;
  uv_index_max: number;
}

export interface WeatherResponse {
  location: string;
  country: string;
  latitude: number;
  longitude: number;
  timezone: string;
  current: CurrentWeather;
  hourly: HourlyForecastItem[];
  daily: DailyForecastItem[];
  fetched_at: string;
  is_stale?: boolean;
  cache_status?: string;
}

export interface AirQualityResponse {
  location: string;
  latitude: number;
  longitude: number;
  aqi: number;
  aqi_category: string;
  aqi_color: string;
  pm2_5: number;
  pm10: number;
  ozone: number;
  nitrogen_dioxide: number;
  carbon_monoxide?: number;
  uv_index: number;
  fetched_at: string;
  is_stale?: boolean;
  cache_status?: string;
}

export interface RecommendationItem {
  category: string;
  icon: string;
  title: string;
  message: string;
  severity: 'good' | 'moderate' | 'warning' | 'danger' | 'info';
}

export interface RecommendationResponse {
  profile: UserProfile;
  profile_label: string;
  location: string;
  summary: string;
  items: RecommendationItem[];
  best_time: string;
  fetched_at: string;
}

export interface AlertItem {
  type: string;
  severity: 'info' | 'warning' | 'danger';
  title: string;
  message: string;
  icon: string;
}

export interface AlertsResponse {
  location: string;
  alerts: AlertItem[];
  fetched_at: string;
}

export interface LocationSearchResult {
  name: string;
  country: string;
  admin1?: string;
  latitude: number;
  longitude: number;
  display_name?: string;
}

export interface SavedLocation {
  id?: number | string;
  name: string;
  country: string;
  latitude: number;
  longitude: number;
  is_default?: boolean;
  temp?: number;
  condition?: string;
  weather_code?: number;
}
