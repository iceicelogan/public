import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // In CI the workflow sets VITE_BASE_URL=/public/ (the GitHub repo name).
  // Locally it stays '/' so dev mode works normally.
  base: process.env.VITE_BASE_URL ?? '/',
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
  },
});
