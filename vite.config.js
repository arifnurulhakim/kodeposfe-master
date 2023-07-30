import { fileURLToPath, URL } from 'url'; // Change 'node:url' to 'url'

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// Obtain the directory name from the URL
const __dirname = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig(() => {
  return {
    plugins: [vue()],
    resolve: {
      alias: {
        '@': `${__dirname}/src`, // Use __dirname to resolve the src path
      },
    },
    build: {
      outDir: 'build',
    },
  };
});
