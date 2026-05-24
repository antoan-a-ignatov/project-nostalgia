// Import Vite configuration helper
import { defineConfig } from 'vite'

// Import React plugin for Vite
import react from '@vitejs/plugin-react'

// Import Tailwind plugin for Vite
import tailwindcss from '@tailwindcss/vite'

// Export Vite configuration
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
})