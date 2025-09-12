<template>
  <div id="app">
    <Dashboard />
  </div>
</template>

<script setup lang="ts">
import Dashboard from './views/Dashboard.vue';
</script>

<style>
/* Styles globaux pour Mapbox */
@import 'mapbox-gl/dist/mapbox-gl.css';

/* Réinitialisation et styles de base */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  height: 100%;
  overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
}

#app {
  height: 100vh;
  width: 100vw;
}

/* Styles pour les éléments Mapbox */
.mapboxgl-popup-content {
  background: rgba(0, 0, 0, 0.8) !important;
  color: white !important;
  border-radius: 12px !important;
  border: 1px solid rgba(255, 255, 255, 0.2) !important;
}

.mapboxgl-popup-tip {
  border-top-color: rgba(0, 0, 0, 0.8) !important;
}

.mapboxgl-ctrl-group {
  background: rgba(255, 255, 255, 0.1) !important;
  border: 1px solid rgba(255, 255, 255, 0.2) !important;
  border-radius: 8px !important;
  backdrop-filter: blur(10px);
}

.mapboxgl-ctrl-group button {
  background: transparent !important;
  color: white !important;
}

.mapboxgl-ctrl-group button:hover {
  background: rgba(255, 255, 255, 0.1) !important;
}

/* Scrollbars personnalisées */
::-webkit-scrollbar {
  width: 4px;
}

::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
}

::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 2px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}
</style>