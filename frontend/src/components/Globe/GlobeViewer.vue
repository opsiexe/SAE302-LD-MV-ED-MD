<template>
  <div class="relative h-full w-full rounded-2xl overflow-hidden">
    <div ref="mapContainer" class="h-full w-full"></div>
    
    <div class="absolute top-6 left-6 right-6 z-10">
      <SearchBar @location-selected="onLocationSelected" />
    </div>

    <div v-if="currentLocation" class="absolute bottom-6 left-6 z-10">
      <div class="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-4 py-3">
        <div class="text-white font-medium">{{ currentLocation.name }}</div>
        <div class="text-white/60 text-sm">
          {{ currentLocation.state ? `${currentLocation.state}, ` : '' }}{{ currentLocation.country }}
        </div>
        <div class="text-white/60 text-xs mt-1">
          {{ currentLocation.lat.toFixed(4) }}, {{ currentLocation.lon.toFixed(4) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { MapboxService } from '../../services/mapboxService';
import { geocodingService } from '../../services/geocodingService';
import SearchBar from './SearchBar.vue';
import type { GeocodingResult, Coordinates } from '../../types/location';

const emit = defineEmits<{
  locationChanged: [coordinates: Coordinates];
}>();

const props = defineProps<{
  initialLocation?: Coordinates;
}>();

const mapContainer = ref<HTMLElement>();
const currentLocation = ref<GeocodingResult | null>(null);

let mapboxService: MapboxService;

onMounted(async () => {
  if (!mapContainer.value) return;

  mapboxService = new MapboxService();
  const map = mapboxService.initializeMap(mapContainer.value);

  // Écouter les clics sur la carte
  mapboxService.addClickListener(async (coordinates) => {
    await updateLocation(coordinates);
  });

  // Définir la localisation initiale
  if (props.initialLocation) {
    await updateLocation(props.initialLocation);
  }
});

onUnmounted(() => {
  if (mapboxService) {
    mapboxService.destroy();
  }
});

const onLocationSelected = async (result: GeocodingResult) => {
  const coordinates = {
    lat: result.lat,
    lon: result.lon
  };
  
  currentLocation.value = result;
  mapboxService.flyToLocation(coordinates);
  emit('locationChanged', coordinates);
};

const updateLocation = async (coordinates: Coordinates) => {
  try {
    const results = await geocodingService.reverseGeocode(coordinates);
    if (results.length > 0) {
      currentLocation.value = results[0];
    }
    emit('locationChanged', coordinates);
  } catch (error) {
    console.warn('Erreur lors du géocodage inverse:', error);
    // Émettre les coordonnées même en cas d'erreur
    emit('locationChanged', coordinates);
  }
};

// Permettre de changer la localisation depuis l'extérieur
watch(() => props.initialLocation, (newLocation) => {
  if (newLocation && mapboxService) {
    updateLocation(newLocation);
    mapboxService.flyToLocation(newLocation);
  }
}, { deep: true });
</script>