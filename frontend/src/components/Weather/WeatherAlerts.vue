<template>
  <div v-if="alerts.length > 0" class="space-y-4">
    <div
      v-for="alert in alerts"
      :key="`${alert.start}-${alert.end}`"
      class="bg-red-500/20 backdrop-blur-md border border-red-500/30 rounded-xl p-4"
    >
      <div class="flex items-start space-x-3">
        <div class="text-red-400 text-2xl mt-1">⚠️</div>
        <div class="flex-1">
          <div class="flex items-center justify-between mb-2">
            <h4 class="text-red-400 font-medium">{{ alert.event }}</h4>
            <div class="text-red-300/80 text-xs">
              {{ alert.sender_name }}
            </div>
          </div>
          
          <p class="text-red-200/90 text-sm mb-3 leading-relaxed">
            {{ alert.description }}
          </p>
          
          <div class="flex items-center justify-between text-xs text-red-300/70">
            <span>Du {{ formatDate(alert.start) }}</span>
            <span>Au {{ formatDate(alert.end) }}</span>
          </div>
          
          <div v-if="alert.tags && alert.tags.length > 0" class="mt-2 flex flex-wrap gap-1">
            <span
              v-for="tag in alert.tags"
              :key="tag"
              class="inline-block px-2 py-1 bg-red-500/20 text-red-300 text-xs rounded-md"
            >
              {{ tag }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { weatherService } from '../../services/weatherService';
import { formatDate } from '../../utils/formatters';
import type { WeatherAlert } from '../../types/weather';
import type { Coordinates } from '../../types/location';

const props = defineProps<{
  coordinates?: Coordinates;
}>();

const alerts = ref<WeatherAlert[]>([]);

const fetchAlerts = async () => {
  if (!props.coordinates) return;

  try {
    alerts.value = await weatherService.getWeatherAlerts(props.coordinates);
  } catch (error) {
    // En cas d'erreur, on vide simplement les alertes
    alerts.value = [];
  }
};

watch(() => props.coordinates, fetchAlerts, { immediate: true, deep: true });
</script>