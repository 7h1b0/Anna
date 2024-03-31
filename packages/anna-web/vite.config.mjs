import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
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
        target: 'http://127.0.0.1:80',
        secure: false,
      },
    },
  },
  preview: {
    port: 3000,
  },
});
