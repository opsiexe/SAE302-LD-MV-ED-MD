<template>
  <div class="bg-red-500/10 border border-red-500/20 rounded-xl p-4 backdrop-blur-sm">
    <div class="flex items-center space-x-3">
      <div class="text-red-400 text-xl">⚠️</div>
      <div>
        <h3 class="text-red-400 font-medium">Erreur</h3>
        <p class="text-red-300 text-sm mt-1">{{ message }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  message: string;
}

defineProps<Props>();
</script>