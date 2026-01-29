import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    // Vite handles env variables differently; this ensures the SDK finds the key
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY)
  },
  build: {
    target: 'esnext',
    outDir: 'dist'
  }
});