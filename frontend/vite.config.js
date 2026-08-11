import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // base: './' is required for Capacitor to resolve assets correctly from the Android WebView
  base: './',
  server: {
    port: 5173,
    // Proxy only used in local dev — APK uses API_BASE_URL from config.js directly
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true,
        secure: false
      }
    }
  }
})
