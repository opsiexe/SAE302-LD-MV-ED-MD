// src/services/weatherService.ts
import axios from 'axios';
import { API_BASE_URL, WEATHER_ENDPOINTS } from '../utils/constants';
import type { 
  CurrentWeather, 
  HourlyWeather, 
  DailyWeather, 
  WeatherAlert 
} from '../types/weather';
import type { Coordinates } from '../types/location';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000
});

export const weatherService = {
  async getCurrentWeather(coordinates: Coordinates): Promise<CurrentWeather> {
    const response = await api.get(WEATHER_ENDPOINTS.CURRENT, {
      params: {
        lat: coordinates.lat,
        lon: coordinates.lon
      }
    });
    return response.data;
  },

  async getHourlyWeather(coordinates: Coordinates): Promise<HourlyWeather[]> {
    const response = await api.get(WEATHER_ENDPOINTS.HOURLY, {
      params: {
        lat: coordinates.lat,
        lon: coordinates.lon
      }
    });
    return response.data;
  },

  async getDailyWeather(coordinates: Coordinates): Promise<DailyWeather[]> {
    const response = await api.get(WEATHER_ENDPOINTS.DAILY, {
      params: {
        lat: coordinates.lat,
        lon: coordinates.lon
      }
    });
    return response.data;
  },

  async getWeatherAlerts(coordinates: Coordinates): Promise<WeatherAlert[]> {
    try {
      const response = await api.get(WEATHER_ENDPOINTS.ALERTS, {
        params: {
          lat: coordinates.lat,
          lon: coordinates.lon
        }
      });
      return response.data || [];
    } catch (error) {
      // Les alertes peuvent ne pas être disponibles pour toutes les régions
      console.warn('Alertes météo non disponibles:', error);
      return [];
    }
  }
};