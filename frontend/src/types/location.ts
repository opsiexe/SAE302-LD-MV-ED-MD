// src/types/location.ts
export interface Coordinates {
  lat: number;
  lon: number;
}

export interface GeocodingResult {
  name: string;
  local_names?: Record<string, string>;
  lat: number;
  lon: number;
  country: string;
  state?: string;
}

export interface Location {
  name: string;
  country: string;
  state?: string;
  coordinates: Coordinates;
}