// src/main.ts
import { createApp } from 'vue';
import App from './App.vue';
import './style.css';

// Vérifier que le token Mapbox est présent
if (!import.meta.env.VITE_MAPBOX_ACCESS_TOKEN) {
  console.error('VITE_MAPBOX_ACCESS_TOKEN is required. Please add it to your .env file.');
}

const app = createApp(App);

app.mount('#app');