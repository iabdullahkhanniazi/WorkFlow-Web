import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  // This path MUST exactly match your GitHub repository name
  base: '/WorkFlow-Web/', 
  plugins: [react()],
})
