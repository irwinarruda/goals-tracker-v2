import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    root: './src',
    globals: true,
    coverage: {
      reportsDirectory: './__coverage__',
      include: ['logic/goal.ts'],
    },
  },
});
