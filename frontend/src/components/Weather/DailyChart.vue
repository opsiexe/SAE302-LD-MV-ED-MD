<template>
  <div class="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
    <h3 class="text-white font-medium mb-4">Prévisions 7 jours</h3>
    
    <div v-if="loading" class="flex items-center justify-center py-8">
      <LoadingSpinner />
    </div>

    <div v-else-if="error" class="py-4">
      <ErrorMessage :message="error" />
    </div>

    <div v-else-if="dailyData.length > 0" class="space-y-3">
      <!-- Liste des jours -->
      <div 
        v-for="(day, index) in dailyData.slice(0, 7)" 
        :key="day.dt"
        class="flex items-center justify-between py-3 px-4 rounded-xl hover:bg-white/5 transition-colors duration-200"
        :class="{ 'bg-white/5': index === 0 }"
      >
        <div class="flex items-center space-x-4 flex-1">
          <div class="text-2xl">{{ getWeatherIcon(day.weather[0]?.icon) }}</div>
          <div>
            <div class="text-white font-medium">
              {{ index === 0 ? "Aujourd'hui" : formatDateShort(day.dt) }}
            </div>
            <div class="text-white/60 text-sm capitalize">
              {{ day.weather[0]?.description }}
            </div>
          </div>
        </div>

        <div class="flex items-center space-x-4">
          <div class="text-white/60 text-sm">
            {{ Math.round(day.pop * 100) }}%
          </div>
          <div class="text-right">
            <div class="text-white font-medium">{{ formatTemperature(day.temp.max) }}</div>
            <div class="text-white/60 text-sm">{{ formatTemperature(day.temp.min) }}</div>
          </div>
        </div>
      </div>

      <!-- Graphique des températures -->
      <div class="mt-6 h-48">
        <Bar :data="chartData" :options="chartOptions" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { Bar } from 'vue-chartjs';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { weatherService } from '../../services/weatherService';
import { WEATHER_ICONS } from '../../utils/constants';
import { formatTemperature, formatDateShort } from '../../utils/formatters';
import LoadingSpinner from '../UI/LoadingSpinner.vue';
import ErrorMessage from '../UI/ErrorMessage.vue';
import type { DailyWeather } from '../../types/weather';
import type { Coordinates } from '../../types/location';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const props = defineProps<{
  coordinates?: Coordinates;
}>();

const dailyData = ref<DailyWeather[]>([]);
const loading = ref(false);
const error = ref('');

const getWeatherIcon = (icon?: string) => {
  if (!icon) return '☀️';
  return WEATHER_ICONS[icon] || '☀️';
};

const chartData = computed(() => {
  const sevenDays = dailyData.value.slice(0, 7);
  
  return {
    labels: sevenDays.map((day, index) => 
      index === 0 ? "Auj." : formatDateShort(day.dt)
    ),
    datasets: [
      {
        label: 'Max',
        data: sevenDays.map(day => Math.round(day.temp.max)),
        backgroundColor: 'rgba(239, 68, 68, 0.8)',
        borderColor: '#ef4444',
        borderWidth: 1,
        borderRadius: 4,
        borderSkipped: false
      },
      {
        label: 'Min',
        data: sevenDays.map(day => Math.round(day.temp.min)),
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: '#3b82f6',
        borderWidth: 1,
        borderRadius: 4,
        borderSkipped: false
      }
    ]
  };
});

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      position: 'top' as const,
      labels: {
        color: '#ffffff',
        usePointStyle: true,
        font: {
          size: 12
        }
      }
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      titleColor: '#ffffff',
      bodyColor: '#ffffff',
      borderColor: 'rgba(255, 255, 255, 0.2)',
      borderWidth: 1,
      callbacks: {
        label: (context: any) => {
          return `${context.dataset.label}: ${formatTemperature(context.parsed.y)}`;
        }
      }
    }
  },
  scales: {
    x: {
      display: true,
      grid: {
        color: 'rgba(255, 255, 255, 0.1)',
        drawBorder: false
      },
      ticks: {
        color: '#ffffff',
        font: {
          size: 11
        }
      }
    },
    y: {
      display: true,
      grid: {
        color: 'rgba(255, 255, 255, 0.1)',
        drawBorder: false
      },
      ticks: {
        color: '#ffffff',
        font: {
          size: 11
        },
        callback: (value: any) => `${value}°`
      }
    }
  }
}));

const fetchDailyWeather = async () => {
  if (!props.coordinates) return;

  loading.value = true;
  error.value = '';

  try {
    dailyData.value = await weatherService.getDailyWeather(props.coordinates);
  } catch (err) {
    error.value = 'Impossible de charger les prévisions journalières';
    dailyData.value = [];
  } finally {
    loading.value = false;
  }
};

watch(() => props.coordinates, fetchDailyWeather, { immediate: true, deep: true });
</script>