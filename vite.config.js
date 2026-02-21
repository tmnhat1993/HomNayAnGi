import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  base: '/HomNayAnGi/dist/',
  root: '.',
  publicDir: 'public',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
      },
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'js'),
      '@assets': resolve(__dirname, 'assets'),
    },
  },
});
