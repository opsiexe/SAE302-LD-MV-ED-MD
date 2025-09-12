import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  define: {
    // Définir des variables globales si nécessaire
    __VUE_PROD_DEVTOOLS__: false,
  },
  server: {
    host: true,
    port: 3000,
  },
  build: {
    target: 'esnext',
    sourcemap: true,
  },
  optimizeDeps: {
    include: ['mapbox-gl', 'chart.js', 'vue-chartjs']
  }
})