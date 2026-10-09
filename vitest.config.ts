import { defineConfig } from 'vitest/config'

/** Separate from vite.config.ts on purpose: that config exists to serve the
 * app (the PWA plugin, the React plugin, the dev API middleware) and none of
 * it has anything to do with running the tests. Loading it here would spin up
 * a service worker build and a set of /api routes for every `npm test`. */
export default defineConfig({
  // The tests cover pure logic and data — the paywall arithmetic, key layouts,
  // timezone anchoring, the translation and guide tables. None of it needs a
  // DOM, and the one .tsx case (bidiText) inspects the elements it builds
  // rather than rendering them, so jsdom would be weight for nothing.
  esbuild: { jsx: 'automatic' },
  test: {
    environment: 'node',
    include: ['tests/**/*.test.ts', 'tests/**/*.test.tsx'],
  },
})
