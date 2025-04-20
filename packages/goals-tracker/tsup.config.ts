import { defineConfig, Options } from 'tsup';

export default defineConfig((options: Options) => ({
  entry: {
    logic: 'src/logic.ts',
    native: 'src/native.ts',
    tokens: 'src/tokens.ts',
    web: 'src/web.ts',
  },
  banner: {
    js: "'use client'",
  },
  clean: true,
  format: ['esm'],
  dts: true,
  ...options,
}));
