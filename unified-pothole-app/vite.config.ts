import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // Make env variables available at build time
    'process.env': process.env
  },
  server: {
    port: 3000,
    open: true
  }
})
