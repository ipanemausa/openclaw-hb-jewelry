import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const GATEWAY_URL      = process.env.VITE_GATEWAY_URL      || 'http://localhost:8080'
const ORCHESTRATOR_URL = process.env.VITE_ORCHESTRATOR_URL || 'http://localhost:8090'

export default defineConfig({
  base: '/',
  define: {
    IS_PROD: 'window.location.hostname !== "localhost"'
  },
  plugins: [react()],
  server: {
    proxy: {
      '/api/mcp': {
        target: GATEWAY_URL,
        changeOrigin: true
      },
      '/api/chat': {
        target: ORCHESTRATOR_URL,
        changeOrigin: true
      },
      '/api/tareas': {
        target: ORCHESTRATOR_URL,
        changeOrigin: true
      },
      '/stack': {
        target: ORCHESTRATOR_URL,
        changeOrigin: true
      },
      '/dashboard': {
        target: GATEWAY_URL,
        changeOrigin: true
      },
      '/api/hb': {
        target: 'http://localhost:3001',
        changeOrigin: true
      },
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