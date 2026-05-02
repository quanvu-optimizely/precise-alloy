import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    root: './src',
    environment: 'jsdom',
    globals: true,
    include: ['**/*.test.ts'],
  },
});
