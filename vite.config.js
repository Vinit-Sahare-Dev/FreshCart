import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/freshcart/', // if deploying to GitHub Pages
  build: {
    outDir: 'dist',
    sourcemap: true
  },
  server: {
    historyApiFallback: true, // Important for SPA
    allowedHosts: ['localhost']
  }
})