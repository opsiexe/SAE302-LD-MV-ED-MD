<template>
  <div class="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
    <div v-if="loading" class="flex items-center justify-center py-8">
      <LoadingSpinner />
    </div>

    <div v-else-if="error" class="py-4">
      <ErrorMessage :message="error" />
    </div>

    <div v-else-if="weather" class="space-y-6">
      <!-- Température principale et condition -->
      <div class="text-center">
        <div class="text-6xl mb-2">{{ weatherIcon }}</div>
        <div class="text-5xl font-thin text-white mb-2">
          {{ formatTemperature(weather.temp) }}
        </div>
        <div class="text-white/80 capitalize">{{ weather.weather[0]?.description }}</div>
        <div class="text-white/60 text-sm mt-2">
          Ressenti {{ formatTemperature(weather.feels_like) }}
        </div>
      </div>

      <!-- Détails météo -->
      <div class="grid grid-cols-2 gap-4">
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-white/60 text-sm">Humidité</span>
            <span class="text-white">{{ formatHumidity(weather.humidity) }}</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-white/60 text-sm">Pression</span>
            <span class="text-white">{{ formatPressure(weather.pressure) }}</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-white/60 text-sm">Visibilité</span>
            <span class="text-white">{{ formatVisibility(weather.visibility) }}</span>
          </div>
        </div>
        
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-white/60 text-sm">Vent</span>
            <span class="text-white">
              {{ formatWindSpeed(weather.wind_speed) }}
              {{ getWindDirection(weather.wind_deg) }}
            </span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-white/60 text-sm">UV Index</span>
            <span class="text-white">{{ Math.round(weather.uvi) }}</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-white/60 text-sm">Nuages</span>
            <span class="text-white">{{ weather.clouds }}%</span>
          </div>
        </div>
      </div>

      <!-- Lever/Coucher du soleil -->
      <div class="flex items-center justify-between pt-4 border-t border-white/10">
        <div class="text-center">
          <div class="text-white/60 text-sm">Lever</div>
          <div class="text-white">{{ formatTime(weather.sunrise) }}</div>
        </div>
        <div class="text-center">
          <div class="text-white/60 text-sm">Coucher</div>
          <div class="text-white">{{ formatTime(weather.sunset) }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { weatherService } from '../../services/weatherService';
import { WEATHER_ICONS } from '../../utils/constants';
import { 
  formatTemperature, 
  formatTime, 
  formatWindSpeed, 
  formatPressure, 
  formatHumidity, 
  formatVisibility,
  getWindDirection 
} from '../../utils/formatters';
import LoadingSpinner from '../UI/LoadingSpinner.vue';
import ErrorMessage from '../UI/ErrorMessage.vue';
import type { CurrentWeather } from '../../types/weather';
import type { Coordinates } from '../../types/location';

const props = defineProps<{
  coordinates?: Coordinates;
}>();

const weather = ref<CurrentWeather | null>(null);
const loading = ref(false);
const error = ref('');

const weatherIcon = computed(() => {
  if (!weather.value?.weather[0]?.icon) return '☀️';
  return WEATHER_ICONS[weather.value.weather[0].icon] || '☀️';
});

const fetchWeather = async () => {
  if (!props.coordinates) return;

  loading.value = true;
  error.value = '';

  try {
    weather.value = await weatherService.getCurrentWeather(props.coordinates);
  } catch (err) {
    error.value = 'Impossible de charger les données météo';
    weather.value = null;
  } finally {
    loading.value = false;
  }
};

watch(() => props.coordinates, fetchWeather, { immediate: true, deep: true });
</script>