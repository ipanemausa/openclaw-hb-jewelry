import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const GATEWAY_URL = process.env.VITE_GATEWAY_URL || 'http://localhost:8080'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: GATEWAY_URL,
        changeOrigin: true
      },
      '/health': {
        target: GATEWAY_URL,
        changeOrigin: true
      }
    }
  },
  build: {
    outDir: 'dist'
  }
})