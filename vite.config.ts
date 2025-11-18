import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // Ensure process.env can be accessed for the API KEY.
    // Vite replaces import.meta.env with process.env during build.
    'process.env': {}
  }
})
