import { defineConfig, Options } from 'tsup';

export default defineConfig((options: Options) => ({
  treeshake: true,
  splitting: true,
  entry: ['./src/index.ts', './src/**/*.tsx'],
  format: ['esm'],
  dts: true,
  minify: true,
  clean: true,
  external: ['react'],
  sourcemap: true,
  ...options
}));
