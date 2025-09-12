<template>
  <div class="h-screen w-screen overflow-hidden bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
    <!-- Grid principal -->
    <div class="h-full grid grid-cols-12 grid-rows-8 gap-4 p-4">
      <!-- Globe 3D - Colonne gauche, occupe 8 colonnes et 8 rangées -->
      <div class="col-span-8 row-span-8">
        <GlobeViewer 
          :initial-location="currentCoordinates" 
          @location-changed="onLocationChanged" 
        />
      </div>

      <!-- Météo actuelle - Haut droite -->
      <div class="col-span-4 row-span-4">
        <CurrentWeather :coordinates="currentCoordinates" />
      </div>

      <!-- Prévisions horaires - Milieu droite -->
      <div class="col-span-4 row-span-2">
        <HourlyChart :coordinates="currentCoordinates" />
      </div>

      <!-- Prévisions journalières - Bas droite -->
      <div class="col-span-4 row-span-2">
        <DailyChart :coordinates="currentCoordinates" />
      </div>
    </div>

    <!-- Alertes météo - Overlay en bas si présentes -->
    <div 
      v-if="showAlerts" 
      class="absolute bottom-4 left-4 right-4 z-20 max-w-md mx-auto"
    >
      <WeatherAlerts :coordinates="currentCoordinates" />
    </div>

    <!-- Indicateur de chargement global -->
    <div 
      v-if="globalLoading" 
      class="absolute inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-30"
    >
      <div class="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8">
        <LoadingSpinner />
        <p class="text-white text-center mt-4">Chargement des données météo...</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import GlobeViewer from '../components/Globe/GlobeViewer.vue';
import CurrentWeather from '../components/Weather/CurrentWeather.vue';
import HourlyChart from '../components/Weather/HourlyChart.vue';
import DailyChart from '../components/Weather/DailyChart.vue';
import WeatherAlerts from '../components/Weather/WeatherAlerts.vue';
import LoadingSpinner from '../components/UI/LoadingSpinner.vue';
import { weatherService } from '../services/weatherService';
import { DEFAULT_LOCATION } from '../utils/constants';
import type { Coordinates } from '../types/location';

const currentCoordinates = ref<Coordinates>({
  lat: DEFAULT_LOCATION.lat,
  lon: DEFAULT_LOCATION.lon
});

const globalLoading = ref(true);
const showAlerts = ref(false);

const onLocationChanged = async (coordinates: Coordinates) => {
  globalLoading.value = true;
  currentCoordinates.value = coordinates;
  
  // Vérifier s'il y a des alertes pour cette localisation
  try {
    const alerts = await weatherService.getWeatherAlerts(coordinates);
    showAlerts.value = alerts.length > 0;
  } catch {
    showAlerts.value = false;
  }
  
  // Simuler un petit délai pour que l'UI soit fluide
  setTimeout(() => {
    globalLoading.value = false;
  }, 500);
};

onMounted(() => {
  // Géolocalisation automatique si disponible
  if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          lat: position.coords.latitude,
          lon: position.coords.longitude
        };
        onLocationChanged(coords);
      },
      () => {
        // En cas d'erreur, utiliser la localisation par défaut
        onLocationChanged(currentCoordinates.value);
      },
      {
        timeout: 5000,
        enableHighAccuracy: false
      }
    );
  } else {
    onLocationChanged(currentCoordinates.value);
  }
});
</script>