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
    ignores: [
      '.next/**',
      'node_modules/**',
      'storybook-static/**',
      'dist/**',
      'build/**',
      'coverage/**',
      'public/**',
      '*.config.js',
      '*.config.mjs',
      '.eslintrc.js',
      'next-env.d.ts'
    ]
  },
  {
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          varsIgnorePattern: '^_'
        }
      ]
    }
  }
];

export default eslintConfig;
