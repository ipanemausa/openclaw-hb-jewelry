import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://openclaw-operativo-2026.onrender.com',
        changeOrigin: true
      },
      '/health': {
        target: 'https://openclaw-operativo-2026.onrender.com',
        changeOrigin: true
      }
    }
  }
})