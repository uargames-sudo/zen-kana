import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const host = process.env.TAURI_DEV_HOST;

export default defineConfig({
  base: './',
  plugins: [react()],
  clearScreen: false,
  server: {
    port: 3000,
    strictPort: true,
    host: host || false,
    watch: {
      ignored: ['**/src-tauri/**'],
    },
    hmr: host
      ? {
          protocol: 'ws',
          host,
          port: 3001,
        }
      : undefined,
  },
  build: {
    rollupOptions: {
      output: {
        // ponytail: PWA needs single entry for service worker to bundle
        manualChunks: {
          vendor: ['react', 'react-dom']
        }
      }
    }
  }
});
