import globals from 'globals';
import { defineConfig } from 'eslint/config';
import js from '@eslint/js';

export default defineConfig([
  {
    files: ['**/*.js'],
    plugins: {
      js,
    },
    extends: ['js/recommended'],
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
    rules: {
      // Force single quotes for strings
      quotes: ['error', 'single'],
      // Force semicolons at the end of statements
      semi: ['error', 'always'],
    },
  },
]);
