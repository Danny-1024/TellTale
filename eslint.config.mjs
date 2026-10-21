import js from '@eslint/js';
import { defineConfig, globalIgnores } from 'eslint/config';
import prettier from 'eslint-config-prettier';
import vue from 'eslint-plugin-vue';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig([
  globalIgnores([
    '**/node_modules/**',
    '**/dist/**',
    '.work-dev/**',
    '.work-docs/**',
    'outputs/**',
    'coverage/**',
    'references/**',
    'packages/contracts/src/generated/public.js',
  ]),
  {
    files: ['**/*.{js,mjs,ts,vue}'],
    extends: [js.configs.recommended],
    languageOptions: { globals: globals.node },
    linterOptions: { reportUnusedDisableDirectives: 'error' },
  },
  {
    files: ['**/*.{ts,vue}'],
    extends: [tseslint.configs.recommended],
  },
  {
    files: ['apps/web/**/*.vue'],
    extends: [vue.configs['flat/recommended']],
    languageOptions: { parserOptions: { parser: tseslint.parser } },
  },
  {
    files: ['apps/web/src/**/*.{ts,vue}', 'scripts/check-entry.mjs'],
    languageOptions: { globals: globals.browser },
  },
  prettier,
]);
