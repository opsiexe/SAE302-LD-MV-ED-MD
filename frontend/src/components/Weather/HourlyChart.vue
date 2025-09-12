<template>
  <div class="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
    <h3 class="text-white font-medium mb-4">Prévisions horaires</h3>
    
    <div v-if="loading" class="flex items-center justify-center py-8">
      <LoadingSpinner />
    </div>

    <div v-else-if="error" class="py-4">
      <ErrorMessage :message="error" />
    </div>

    <div v-else-if="hourlyData.length > 0" class="h-64">
      <Line :data="chartData" :options="chartOptions" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { Line } from 'vue-chartjs';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { weatherService } from '../../services/weatherService';
import { formatTemperature, formatHour } from '../../utils/formatters';
import LoadingSpinner from '../UI/LoadingSpinner.vue';
import ErrorMessage from '../UI/ErrorMessage.vue';
import type { HourlyWeather } from '../../types/weather';
import type { Coordinates } from '../../types/location';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const props = defineProps<{
  coordinates?: Coordinates;
}>();

const hourlyData = ref<HourlyWeather[]>([]);
const loading = ref(false);
const error = ref('');

const chartData = computed(() => {
  const next24Hours = hourlyData.value.slice(0, 24);
  
  return {
    labels: next24Hours.map(hour => formatHour(hour.dt)),
    datasets: [
      {
        label: 'Température',
        data: next24Hours.map(hour => Math.round(hour.temp)),
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 3,
        pointHoverRadius: 6,
        pointBackgroundColor: '#3b82f6',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2
      },
      {
        label: 'Ressenti',
        data: next24Hours.map(hour => Math.round(hour.feels_like)),
        borderColor: '#8b5cf6',
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        fill: false,
        tension: 0.4,
        pointRadius: 2,
        pointHoverRadius: 5,
        pointBackgroundColor: '#8b5cf6',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 1,
        borderDash: [5, 5]
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
  },
  elements: {
    point: {
      hoverBackgroundColor: '#ffffff'
    }
  }
}));

const fetchHourlyWeather = async () => {
  if (!props.coordinates) return;

  loading.value = true;
  error.value = '';

  try {
    hourlyData.value = await weatherService.getHourlyWeather(props.coordinates);
  } catch (err) {
    error.value = 'Impossible de charger les prévisions horaires';
    hourlyData.value = [];
  } finally {
    loading.value = false;
  }
};

watch(() => props.coordinates, fetchHourlyWeather, { immediate: true, deep: true });
</script>