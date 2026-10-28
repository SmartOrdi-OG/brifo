/** Every icon the app asks for has to exist on disk.
 *
 * Icons are referenced as plain strings — `src="/icons/icon-192-v3.png"` in
 * JSX, a path in the manifest, an href in index.html. Vite never resolves
 * them, so renaming a file in public/icons/ breaks the reference silently:
 * the build passes, the tests pass, and the app ships a broken image.
 *
 * That is not hypothetical. Renaming this set from -v2 to -v3 updated
 * index.html and vite.config.ts and missed AuthGate and PrivacyConsentGate —
 * the sign-in screen and the consent screen, which are the first two things
 * a new user sees, and the only two places a broken icon would have been
 * least forgivable.
 *
 * The version suffix exists because iOS and the service worker both cache
 * the home-screen icon by URL, so the file has to be renamed to be replaced
 * at all. Which means this will happen again.
 */
import { describe, it, expect } from 'vitest';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = join(import.meta.dirname, '..');
const PUBLIC = join(ROOT, 'public');

/** Every `/icons/...` path mentioned in a file that ships. */
function iconPathsIn(relativePath: string): string[] {
  const source = readFileSync(join(ROOT, relativePath), 'utf8');
  return [...source.matchAll(/["'`](\/icons\/[^"'`\s)]+)["'`]/g)].map((m) => m[1]);
}

/** Everything scanned. A path found in any of these must exist. */
const SOURCES = [
  'index.html',
  'vite.config.ts',
  'src/components/AuthGate.tsx',
  'src/components/Header.tsx',
  'src/components/PrivacyConsentGate.tsx',
];

/** The subset that must still reference at least one icon.
 *
 * Zero references usually means the file moved and this test quietly stopped
 * checking anything — except in AuthGate, which deliberately has none: its
 * logo is drawn inline by BrifoWordmark so the name can follow the theme's
 * text colour, which an <img> cannot do. */
const MUST_REFERENCE = SOURCES.filter((s) => !s.endsWith('AuthGate.tsx'));

describe('every referenced icon exists', () => {
  for (const source of SOURCES) {
    it(`${source}`, () => {
      const paths = iconPathsIn(source);
      if (MUST_REFERENCE.includes(source)) {
        expect(paths.length, `${source} references no icons — has it moved?`).toBeGreaterThan(0);
      }
      for (const path of paths) {
        expect(existsSync(join(PUBLIC, path)), `${source} wants ${path}, which is not in public/`).toBe(true);
      }
    });
  }

  it('finds the icons across every source together', () => {
    const all = SOURCES.flatMap(iconPathsIn);
    const missing = all.filter((p) => !existsSync(join(PUBLIC, p)));
    expect(missing).toEqual([]);
  });
});

describe('the manifest and the gates agree on the version', () => {
  it('references exactly one version suffix across the whole app', () => {
    // A half-finished rename is the failure this file exists for: some
    // screens on -v3, others still on -v2, and only the stale ones break.
    const suffixes = new Set(
      SOURCES.flatMap(iconPathsIn)
        .map((p) => p.match(/-v(\d+)\.png$/)?.[1])
        .filter((v): v is string => v !== undefined),
    );
    expect([...suffixes], `found icons on more than one version: ${[...suffixes].join(', ')}`).toHaveLength(1);
  });

  it('leaves no icon of a previous version behind in public/', () => {
    // Deleting the old files is what forces the references to be updated;
    // leaving them means a stale reference keeps working and nobody notices.
    const current = [...new Set(SOURCES.flatMap(iconPathsIn).map((p) => p.match(/-v(\d+)\.png$/)?.[1]))].filter(
      Boolean,
    )[0];
    const strays = readdirSync(join(PUBLIC, 'icons')).filter((f) => {
      const version = f.match(/-v(\d+)\.png$/)?.[1];
      return version !== undefined && version !== current;
    });
    expect(strays, `old icons still in public/icons: ${strays.join(', ')}`).toEqual([]);
  });
});

describe('the maskable icon is declared as one', () => {
  it('is the only icon carrying purpose: maskable', () => {
    // Without the purpose, Android treats it as an ordinary icon and the
    // padding that keeps it clear of the crop looks like a mistake instead.
    const config = readFileSync(join(ROOT, 'vite.config.ts'), 'utf8');
    const maskable = [...config.matchAll(/src:\s*'(\/icons\/[^']+)',[\s\S]{0,160}?purpose:\s*'maskable'/g)];
    expect(maskable, 'no icon declares purpose: maskable').toHaveLength(1);
    expect(maskable[0][1]).toContain('maskable');
  });
});
