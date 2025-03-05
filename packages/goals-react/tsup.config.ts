import { defineConfig, Options } from 'tsup';

export default defineConfig((options: Options) => ({
  entry: {
    native: 'src/native.ts',
    web: 'src/web.ts',
    tokens: 'src/tokens.ts',
  },
  banner: {
    js: "'use client'",
  },
  clean: true,
  format: ['cjs', 'esm'],
  dts: true,
  ...options,
}));
