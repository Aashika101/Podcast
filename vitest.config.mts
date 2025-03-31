// import { defineConfig } from 'vitest/config';
// import tsconfigPaths from 'vite-tsconfig-paths';
// import react from '@vitejs/plugin-react';

// export default defineConfig({
//   plugins: [react(), tsconfigPaths()],
//   test: {
//     globals: true,
//     environment: 'jsdom',
//     setupFiles: "./vitest.setup.ts",
//   },
// });


import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';
import react from '@vitejs/plugin-react';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.test' }); // Load environment variables from .env.test

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './vitest.setup.ts', // Path to setup file
    environmentOptions: {
      jsdom: {
        resources: 'usable', // Allow loading external resources like images
      },
    },
    coverage: {
      reporter: ['text', 'json', 'html'], // Add coverage reporting
    },
  },
});