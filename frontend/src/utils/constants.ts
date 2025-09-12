// src/utils/constants.ts
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
export const MAPBOX_ACCESS_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

export const WEATHER_ENDPOINTS = {
  CURRENT: '/weather/current',
  HOURLY: '/weather/hourly', 
  DAILY: '/weather/daily',
  ALERTS: '/weather/alerts',
  GEOCODING: '/geocoding',
  REVERSE_GEOCODING: '/geocoding/reverse'
} as const;

export const DEFAULT_LOCATION = {
  lat: 48.8566,
  lon: 2.3522,
  name: 'Paris',
  country: 'FR'
};

export const WEATHER_ICONS: Record<string, string> = {
  '01d': '☀️', // clear sky day
  '01n': '🌙', // clear sky night
  '02d': '⛅', // few clouds day
  '02n': '☁️', // few clouds night
  '03d': '☁️', // scattered clouds
  '03n': '☁️',
  '04d': '☁️', // broken clouds
  '04n': '☁️',
  '09d': '🌧️', // shower rain
  '09n': '🌧️',
  '10d': '🌦️', // rain day
  '10n': '🌧️', // rain night
  '11d': '⛈️', // thunderstorm
  '11n': '⛈️',
  '13d': '❄️', // snow
  '13n': '❄️',
  '50d': '🌫️', // mist
  '50n': '🌫️'
};