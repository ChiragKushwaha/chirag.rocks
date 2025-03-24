import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname
});

const eslintConfig = [
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    env: {
      browser: true,
      node: true,
      jest: true,
    },
    ignores: [
      ".next/**",
      "node_modules/**",
      "dist/**",
      "build/**",
      "coverage/**",
      "public/**",
      "*.config.js",
      "*.config.mjs",
      ".eslintrc.js",
      "next-env.d.ts"
    ]
  }
];

export default eslintConfig;
