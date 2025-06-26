import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['recharts'],
    esbuildOptions: {
      // Recharts workaround for "Unexpected token export"
      mainFields: ['module', 'main'],
    },
  },
  resolve: {
    dedupe: ['recharts'],
  },
});
