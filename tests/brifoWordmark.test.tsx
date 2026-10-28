/** The lockup, and the two things about it that fail silently.
 *
 * The supplied SVG sets the name in a fixed #1C1D3A. That is the light
 * theme's --text, so on the light theme it looks perfect and on the dark
 * theme the name is invisible against the background — a fault nobody
 * reviewing the light screen would ever see.
 *
 * The reversed tone has the same shape of problem in the other direction.
 * The sign-in hero is a gradient built from --blue and --purple, the same
 * two colours the mark is drawn in, so the brand tone all but disappears on
 * it. Reversed has to draw every part in currentColor and knock the paper
 * out, or the envelope is a blue outline on a blue ground.
 *
 * Both are invisible to a build and to every other test, so they are pinned
 * here. */
import { describe, it, expect } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { BrifoWordmark } from '../src/components/BrifoWordmark';

const render = (el: React.ReactElement) => renderToStaticMarkup(el);

describe('the name follows the theme', () => {
  it('never hard-codes the fixed navy from the source file', () => {
    // #1C1D3A is --text on the light theme only. Baked in, the name
    // disappears the moment someone switches to dark.
    for (const tone of ['brand', 'reversed'] as const) {
      expect(render(<BrifoWordmark tone={tone} />), tone).not.toContain('1C1D3A');
    }
  });

  it('draws the name in currentColor in both tones', () => {
    for (const tone of ['brand', 'reversed'] as const) {
      expect(render(<BrifoWordmark tone={tone} />), tone).toContain('currentColor');
    }
  });
});

describe('the reversed tone', () => {
  it('drops both brand colours, which are the hero gradient', () => {
    // The hero is linear-gradient(var(--blue), var(--purple)) — #3B82F6 to
    // #8B5CF6. Either one left in the mark is an outline that vanishes.
    const svg = render(<BrifoWordmark tone="reversed" />);
    expect(svg).not.toContain('3B82F6');
    expect(svg).not.toContain('8B5CF6');
  });

  it('knocks the paper out instead of filling it white', () => {
    // A white fill would be a solid white envelope sitting on the gradient,
    // not a reversed lockup.
    expect(render(<BrifoWordmark tone="reversed" />)).not.toContain('#FFFFFF');
  });

  it('is not what you get by default', () => {
    // Default has to be the coloured one: most surfaces in the app are light
    // cards, where an all-currentColor lockup would be one flat shape.
    const brand = render(<BrifoWordmark />);
    expect(brand).toContain('3B82F6');
    expect(brand).toContain('8B5CF6');
  });
});

describe('sizing and labelling', () => {
  it('keeps the artwork ratio at any height', () => {
    // 362:114 is the viewBox. A wrong width squashes the letterforms, which
    // is exactly what the old square .auth-logo rule would have done.
    const svg = render(<BrifoWordmark height={114} />);
    expect(svg).toContain('height="114"');
    expect(svg).toContain('width="362"');
  });

  it('carries its own accessible name', () => {
    // The sign-in screen's <h1> is sr-only precisely because this is here;
    // losing it would leave the lockup unlabelled.
    const svg = render(<BrifoWordmark />);
    expect(svg).toContain('role="img"');
    expect(svg).toContain('aria-label="Brifo"');
  });
});
