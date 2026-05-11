import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      build: {
        rollupOptions: {
          output: {
            manualChunks: {
              // Separar React en su propio chunk
              'react-vendor': ['react', 'react-dom'],
              // Separar Leaflet y mapas en su propio chunk
              'maps-vendor': ['leaflet', 'react-leaflet', 'react-leaflet-markercluster'],
              // Separar Firebase en su propio chunk
              'firebase-vendor': ['firebase/app', 'firebase/auth', 'firebase/firestore'],
              // Separar Chart.js en su propio chunk
              'charts-vendor': ['chart.js', 'react-chartjs-2']
            }
          }
        },
        // Configurar límite de chunk para evitar warnings innecesarios
        chunkSizeWarningLimit: 600
      }
    };
});
