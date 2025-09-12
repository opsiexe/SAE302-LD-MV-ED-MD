// src/services/mapboxService.ts
import mapboxgl from 'mapbox-gl';
import { MAPBOX_ACCESS_TOKEN } from '../utils/constants';
import type { Coordinates } from '../types/location';

export class MapboxService {
  private map: mapboxgl.Map | null = null;
  private marker: mapboxgl.Marker | null = null;

  constructor() {
    mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;
  }

  initializeMap(container: string | HTMLElement): mapboxgl.Map {
    this.map = new mapboxgl.Map({
      container,
      style: 'mapbox://styles/mapbox/satellite-v9',
      center: [2.3522, 48.8566], // Paris par défaut
      zoom: 2,
      projection: { name: 'globe' } as any,
      antialias: true
    });

    // Activer la rotation du globe
    this.map.on('load', () => {
      this.map!.setFog({
        'range': [-1, 2],
        'color': '#333',
        'horizon-blend': 0.3,
        'high-color': '#add8e6',
        'space-color': '#0b1426',
        'star-intensity': 0.8
      });
    });

    // Rotation automatique du globe
    this.startGlobeRotation();

    return this.map;
  }

  private startGlobeRotation(): void {
    if (!this.map) return;

    const rotateGlobe = () => {
      if (!this.map || this.map.isMoving()) return;
      
      const center = this.map.getCenter();
      center.lng += 0.1;
      
      if (center.lng > 180) {
        center.lng = -180;
      }
      
      this.map.easeTo({
        center,
        duration: 1000,
        essential: true
      });
    };

    const intervalId = setInterval(rotateGlobe, 2000);

    // Arrêter la rotation lors de l'interaction utilisateur
    this.map.on('mousedown', () => clearInterval(intervalId));
    this.map.on('touchstart', () => clearInterval(intervalId));
  }

  flyToLocation(coordinates: Coordinates): void {
    if (!this.map) return;

    this.map.flyTo({
      center: [coordinates.lon, coordinates.lat],
      zoom: 8,
      duration: 2000,
      essential: true
    });

    this.updateMarker(coordinates);
  }

  private updateMarker(coordinates: Coordinates): void {
    if (this.marker) {
      this.marker.remove();
    }

    this.marker = new mapboxgl.Marker({
      color: '#3b82f6',
      scale: 0.8
    })
      .setLngLat([coordinates.lon, coordinates.lat])
      .addTo(this.map!);
  }

  addClickListener(callback: (coordinates: Coordinates) => void): void {
    if (!this.map) return;

    this.map.on('click', (e) => {
      const { lng: lon, lat } = e.lngLat;
      callback({ lat, lon });
    });
  }

  resize(): void {
    if (this.map) {
      this.map.resize();
    }
  }

  destroy(): void {
    if (this.marker) {
      this.marker.remove();
      this.marker = null;
    }
    
    if (this.map) {
      this.map.remove();
      this.map = null;
    }
  }
}