/** The screen that stands in for the blank one.
 *
 * It exists because `if (authLoading) return null` left the page empty for
 * however long Supabase took to answer, and an empty page reads as a broken
 * app. These pin the two things that make it an answer rather than decoration:
 * it says the app is busy, and it carries no text that would need translating
 * six ways.
 */
import { describe, it, expect } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { SplashScreen } from '../src/components/SplashScreen';

const html = renderToStaticMarkup(<SplashScreen />);

describe('SplashScreen', () => {
  it('announces that something is loading', () => {
    // Without this a screen reader is told nothing at all, which is the same
    // problem the blank screen had.
    expect(html).toContain('aria-busy="true"');
    expect(html).toContain('role="status"');
  });

  it('shows the Brifo lockup', () => {
    expect(html).toContain('aria-label="Brifo"');
    expect(html).toContain('<svg');
  });

  it('shows the spinner', () => {
    expect(html).toContain('splash-spinner');
  });

  it('carries no translatable text', () => {
    // Any sentence here would have to exist in all six languages to say what
    // the spinner already says. Strip the tags: nothing should be left.
    const text = html.replace(/<[^>]*>/g, '').trim();
    expect(text).toBe('');
  });
});
