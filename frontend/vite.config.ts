/// <reference types="vitest" />
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, '.', 'VITE_')
  const apiUrl = process.env.VITE_API_BASE_URL || env.VITE_API_BASE_URL
  if (command === 'build' && (!apiUrl || !apiUrl.startsWith('https://') || /localhost|127\.0\.0\.1/.test(apiUrl))) {
    throw new Error('Set VITE_API_BASE_URL to the HTTPS production API URL before building.')
  }
  return {
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
  },
  }
})
