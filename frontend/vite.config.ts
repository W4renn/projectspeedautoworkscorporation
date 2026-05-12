import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// vite.config.js

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1000, // size in KB
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://projectspeedautoworkscorporation-backend.onrender.com',
        changeOrigin: true,
      },
      '/uploads': {
        target: 'https://projectspeedautoworkscorporation-backend.onrender.com',
        changeOrigin: true,
      },
      '/images': {
        target: 'https://projectspeedautoworkscorporation-backend.onrender.com',
        changeOrigin: true,
      },
      '/public': {
        target: 'https://projectspeedautoworkscorporation-backend.onrender.com',
        changeOrigin: true,
      }
    }
  }
})
