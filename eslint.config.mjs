import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig([
  globalIgnores(['dist/**', '.astro/**', '.next/**', 'node_modules/**']),
]);
