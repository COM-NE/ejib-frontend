import { defineConfig } from 'eslint/config';

export default defineConfig({
  ignorePatterns: ['dist'],
  files: ['**/*.{ts,tsx}'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'plugin:react-refresh/recommended',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: { jsx: true },
  },
  env: {
    browser: true,
    es2020: true,
  },
  rules: {},
});
