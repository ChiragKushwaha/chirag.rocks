import { defineConfig, Options } from 'tsup';
import svgr from 'esbuild-plugin-svgr';

export default defineConfig((options: Options) => ({
  treeshake: true,
  splitting: true,
  entry: ['./index.ts'],
  format: ['esm'],
  dts: true,
  minify: true,
  clean: true,
  external: ['react'],
  esbuildPlugins: [svgr()],
  sourcemap: true,
  ...options
}));
