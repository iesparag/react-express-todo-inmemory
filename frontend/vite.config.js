import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // Setup for local API proxy if needed:
    // proxy: {
    //   '/api': 'http://localhost:3000',
    // },
  },
});
