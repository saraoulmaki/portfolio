import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Relative base so the build works on GitHub Pages under any repo name
  // (https://<user>.github.io/<repo>/) as well as on a custom domain.
  base: './',
  build: {
    // Three.js is lazy-loaded in its own chunk; it is legitimately large.
    chunkSizeWarningLimit: 1200,
  },
})
