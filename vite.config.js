import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  // This line tells your app its correct path on GitHub Pages
  base: '/taskflow-app/', // Make sure this matches your repository name
  plugins: [react()],
})
