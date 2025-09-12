<template>
  <div class="relative">
    <div class="relative">
      <input
        v-model="searchQuery"
        @input="onInput"
        @focus="showResults = true"
        @blur="hideResults"
        @keydown.enter="selectFirst"
        type="text"
        placeholder="Rechercher une ville..."
        class="w-full px-4 py-3 pl-12 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-transparent transition-all duration-200"
      />
      <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <svg class="w-5 h-5 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m21 21-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <div v-if="loading" class="absolute inset-y-0 right-0 pr-4 flex items-center">
        <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white/60"></div>
      </div>
    </div>

    <div
      v-if="showResults && (results.length > 0 || error)"
      class="absolute top-full mt-2 w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-xl overflow-hidden z-50"
    >
      <div v-if="error" class="p-3 text-red-300 text-sm">
        {{ error }}
      </div>
      
      <div v-else>
        <button
          v-for="(result, index) in results"
          :key="`${result.lat}-${result.lon}`"
          @mousedown.prevent="selectResult(result)"
          class="w-full px-4 py-3 text-left hover:bg-white/10 transition-colors duration-200 border-b border-white/10 last:border-b-0"
        >
          <div class="text-white font-medium">{{ result.name }}</div>
          <div class="text-white/60 text-sm">
            {{ result.state ? `${result.state}, ` : '' }}{{ result.country }}
          </div>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { geocodingService } from '../../services/geocodingService';
import type { GeocodingResult } from '../../types/location';

const emit = defineEmits<{
  locationSelected: [result: GeocodingResult];
}>();

const searchQuery = ref('');
const results = ref<GeocodingResult[]>([]);
const loading = ref(false);
const error = ref('');
const showResults = ref(false);

let searchTimeout: ReturnType<typeof setTimeout>;

const onInput = () => {
  if (searchTimeout) {
    clearTimeout(searchTimeout);
  }

  error.value = '';
  
  if (searchQuery.value.trim().length < 2) {
    results.value = [];
    return;
  }

  searchTimeout = setTimeout(async () => {
    await searchLocations();
  }, 300);
};

const searchLocations = async () => {
  if (!searchQuery.value.trim()) return;

  loading.value = true;
  error.value = '';

  try {
    const searchResults = await geocodingService.searchLocation(searchQuery.value.trim());
    results.value = searchResults.slice(0, 5); // Limiter à 5 résultats
  } catch (err) {
    error.value = 'Erreur lors de la recherche';
    results.value = [];
  } finally {
    loading.value = false;
  }
};

const selectResult = (result: GeocodingResult) => {
  searchQuery.value = result.name;
  showResults.value = false;
  results.value = [];
  emit('locationSelected', result);
};

const selectFirst = () => {
  if (results.value.length > 0) {
    selectResult(results.value[0]);
  }
};

const hideResults = () => {
  setTimeout(() => {
    showResults.value = false;
  }, 200);
};
</script>