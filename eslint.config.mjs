import { defineConfig, globalIgnores } from 'eslint/config';

// Keep linting lightweight for this small app.
// (We can add astro/react specific lint rules later if desired.)
export default defineConfig([
  globalIgnores(['dist/**', '.astro/**', '.next/**', 'node_modules/**']),
]);
