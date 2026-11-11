/** The two ways the app could show nothing at all.
 *
 * Reported from the app as "الحقني بريفو وقف" with a photograph of a blank
 * screen. Blank is all it had to give: there was no error boundary anywhere
 * in the tree, so a throw in any screen or any provider unmounted everything
 * and left `#root` empty — no message, no button, no way back, and no clue
 * whether the user's letters were still there.
 *
 * The second way is quieter and worse, because it never settles: the service
 * worker reloads the page whenever a new worker takes over, and the only
 * guard was a variable that the reload itself destroys. A worker that keeps
 * handing over reloads forever, and a white screen that flashes is harder to
 * escape than one that sits still.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { ErrorBoundary } from '../src/components/ErrorBoundary';

const ROOT = join(import.meta.dirname, '..');

describe('a screen that throws does not leave the page empty', () => {
  it('renders something a user can read', () => {
    // renderToStaticMarkup does not run the boundary, so the state is set the
    // way React would set it and the fallback rendered directly.
    const boundary = new ErrorBoundary({ children: null });
    boundary.state = ErrorBoundary.getDerivedStateFromError(new Error('boom'));
    const html = renderToStaticMarkup(boundary.render() as React.ReactElement);
    expect(html.length).toBeGreaterThan(200);
    expect(html).toContain('حدث خطأ');
  });

  it('says in two languages, neither of them looked up', () => {
    // The language context lives inside the boundary, so it may be the thing
    // that threw. Reading it here would throw again and blank the screen a
    // second time — both strings are hard-coded for that reason.
    const boundary = new ErrorBoundary({ children: null });
    boundary.state = ErrorBoundary.getDerivedStateFromError(new Error('boom'));
    const html = renderToStaticMarkup(boundary.render() as React.ReactElement);
    expect(html).toContain('Something went wrong');
    expect(html).toContain('بياناتك محفوظة');
  });

  it('offers a way out, not just an apology', () => {
    const boundary = new ErrorBoundary({ children: null });
    boundary.state = ErrorBoundary.getDerivedStateFromError(new Error('boom'));
    const html = renderToStaticMarkup(boundary.render() as React.ReactElement);
    expect((html.match(/<button/g) ?? []).length).toBe(2);
  });

  it('passes children straight through when nothing is wrong', () => {
    const boundary = new ErrorBoundary({ children: 'the app' });
    expect(boundary.render()).toBe('the app');
  });

  it('is mounted outside every provider', () => {
    // A boundary inside the providers cannot catch a provider that throws,
    // and a provider throwing is exactly the start-up fault that blanks the
    // screen before anything has rendered.
    const main = readFileSync(join(ROOT, 'src/main.tsx'), 'utf8');
    const boundaryAt = main.indexOf('<ErrorBoundary>');
    expect(boundaryAt, 'main.tsx does not mount the boundary').toBeGreaterThan(-1);
    for (const provider of ['<BrowserRouter>', '<ThemeProvider>', '<LanguageProvider>', '<AuthProvider>', '<DataProvider>']) {
      expect(main.indexOf(provider), provider).toBeGreaterThan(boundaryAt);
    }
  });
});

describe('the service worker cannot reload the page forever', () => {
  let reloads = 0;

  beforeEach(() => {
    reloads = 0;
    const store = new Map<string, string>();
    vi.stubGlobal('sessionStorage', {
      getItem: (k: string) => store.get(k) ?? null,
      setItem: (k: string, v: string) => void store.set(k, v),
      removeItem: (k: string) => void store.delete(k),
    });
    vi.stubGlobal('console', { ...console, warn: () => {} });
  });

  afterEach(() => vi.unstubAllGlobals());

  /** What a page does on each controllerchange, with the real guard. */
  async function handoverHappens(times: number) {
    const { __mayReloadAgainForTests } = await import('../src/lib/swAutoReload');
    for (let i = 0; i < times; i++) if (__mayReloadAgainForTests()) reloads++;
  }

  it('reloads for a real update', async () => {
    await handoverHappens(1);
    expect(reloads).toBe(1);
  });

  it('stops after a few, instead of flashing white forever', async () => {
    // Each reload destroys the in-page flag, so without a counter that
    // outlives the page every handover reloads again.
    await handoverHappens(25);
    expect(reloads).toBe(3);
  });

  it('refuses to reload at all when it cannot count', async () => {
    // Private mode, storage disabled. An uncounted reload is the loop.
    vi.stubGlobal('sessionStorage', {
      getItem: () => { throw new Error('denied'); },
      setItem: () => { throw new Error('denied'); },
      removeItem: () => {},
    });
    await handoverHappens(5);
    expect(reloads).toBe(0);
  });
});
