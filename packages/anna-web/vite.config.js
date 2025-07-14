import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import path from 'node:path';

export default defineConfig({
  plugins: [tailwindcss()],
  resolve: {
    alias: { '@': path.resolve(__dirname, 'src') },
  },
  build: {
    sourcemap: false,
    assetsInlineLimit: 0,
    reportCompressedSize: true,
    modulePreload: false,
    target: ['firefox115', 'safari16', 'chrome110'],
  },
  server: {
    port: 3000,
    open: '/',
    proxy: {
      '/api': {
        target: 'http://192.168.1.12:80',
        secure: false,
      },
    },
  },
  preview: {
    port: 3000,
  },
});
