import path from 'node:path';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const apiTarget = (env.VITE_API_URL || 'http://localhost:3000').replace(/\/$/, '');

  return {
    plugins: [react()],
    resolve: {
      alias: { '@': path.resolve(__dirname, 'src') },
    },
    server: {
      port: 5174,
      proxy: {
        '/api': { target: apiTarget, changeOrigin: true, cookieDomainRewrite: 'localhost' },
        '/health': { target: apiTarget, changeOrigin: true },
      },
    },
  };
});
