// src/services/geocodingService.ts
import axios from 'axios';
import { API_BASE_URL, WEATHER_ENDPOINTS } from '../utils/constants';
import type { GeocodingResult, Coordinates } from '../types/location';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000
});

export const geocodingService = {
  async searchLocation(city: string): Promise<GeocodingResult[]> {
    const response = await api.get(WEATHER_ENDPOINTS.GEOCODING, {
      params: { city }
    });
    return response.data;
  },

  async reverseGeocode(coordinates: Coordinates): Promise<GeocodingResult[]> {
    const response = await api.get(WEATHER_ENDPOINTS.REVERSE_GEOCODING, {
      params: {
        lat: coordinates.lat,
        lon: coordinates.lon
      }
    });
    return response.data;
  }
};