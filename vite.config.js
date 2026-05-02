import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  base: process.env.GITHUB_PAGES === 'true' ? '/gami-gomitas-three-demo/' : '/',
  plugins: [react()],
});
