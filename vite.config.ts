import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    // Explicitly shim process.env for client-side access to API_KEY
    'process.env': {
      API_KEY: JSON.stringify(process.env.API_KEY || "")
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: false
  }
});