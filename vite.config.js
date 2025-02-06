import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.js'),
      name: 'RangeSliderElement',
      fileName: 'range-slider-element',
      cssFileName: 'range-slider-element',
    },
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
      },
    },
  },
  test: {
    browser: {
      provider: 'playwright',
      enabled: true,
      // at least one instance is required
      instances: [{ browser: 'chromium' }],
    },
  },
});
