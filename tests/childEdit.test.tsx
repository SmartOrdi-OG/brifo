/** Correcting a family member's name.
 *
 * Reported by a paying customer's own customer: her name is Alaa, and the
 * profile Brifo built for her off a German letter said "علاء" — a different,
 * male name. The app had no way to fix it. Two things had to be true for the
 * fix to be worth shipping:
 *
 *   1. The edit must survive. Children were create-once, so `Child` carried
 *      no `updatedAt`, and lib/mergeState picks a winner by
 *      `updatedAt ?? createdAt`. With both sides stamped at creation the two
 *      records tie forever, each phone keeps its own and pushes it back up,
 *      and the other parent's phone silently undoes the correction.
 *   2. Fixing a spelling must not re-ask for consent. It was given when the
 *      profile was made; an unticked box would have blocked the correction.
 */
import { describe, it, expect, beforeAll } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { mergeStoredState } from '../src/lib/mergeState';
import { normalizeState } from '../src/lib/backup';
import { ChildForm } from '../src/components/ChildForm';
import { LanguageProvider } from '../src/context/LanguageContext';
import type { Child } from '../src/types/data';
import type { RestorableState } from '../src/lib/backup';

const CREATED = '2026-11-01T09:00:00.000Z';

function alaa(overrides: Partial<Child> = {}): Child {
  return {
    id: 'c1',
    name: 'علاء',
    type: 'child',
    schoolClass: '3B',
    color: '#2563eb',
    consentGiven: true,
    consentDate: CREATED,
    createdAt: CREATED,
    updatedAt: CREATED,
    ...overrides,
  };
}

function stateWith(children: Child[]): RestorableState {
  return { children, letters: [], payments: [], events: [], todos: [], rating: null, tombstones: [] };
}

describe('a rename against the cloud copy', () => {
  it('beats the stale record the other device still holds', () => {
    const renamed = alaa({ name: 'Alaa', updatedAt: '2026-11-12T10:00:00.000Z' });
    const merged = mergeStoredState(stateWith([renamed]), stateWith([alaa()]));
    expect(merged.children.map((c) => c.name)).toEqual(['Alaa']);
  });

  it('is kept when the correction arrives from the other device instead', () => {
    // The same merge runs on the phone that did NOT make the edit: there the
    // correction is the remote record, and it has to win just the same, or
    // the two phones disagree about the name permanently.
    const renamed = alaa({ name: 'Alaa', updatedAt: '2026-11-12T10:00:00.000Z' });
    const merged = mergeStoredState(stateWith([alaa()]), stateWith([renamed]));
    expect(merged.children.map((c) => c.name)).toEqual(['Alaa']);
  });

  it('does not resurrect a member deleted on the other device', () => {
    const renamed = alaa({ name: 'Alaa', updatedAt: '2026-11-12T10:00:00.000Z' });
    const remote = {
      ...stateWith([]),
      tombstones: [{ id: 'c1', deletedAt: '2026-11-12T11:00:00.000Z' }],
    };
    expect(mergeStoredState(stateWith([renamed]), remote).children).toEqual([]);
  });
});

describe('records written before updatedAt existed', () => {
  it('are given one on the way in, rather than left to tie forever', () => {
    const { updatedAt: _dropped, ...legacy } = alaa();
    const restored = normalizeState({ children: [legacy] });
    expect(restored.children[0].updatedAt).toBe(CREATED);
  });

  it('still lose to a later edit once backfilled', () => {
    const { updatedAt: _dropped, ...legacy } = alaa();
    const cloud = normalizeState({ children: [legacy] });
    const renamed = alaa({ name: 'Alaa', updatedAt: '2026-11-12T10:00:00.000Z' });
    expect(mergeStoredState(stateWith([renamed]), cloud).children[0].name).toBe('Alaa');
  });
});

describe('the edit form', () => {
  beforeAll(() => {
    // LanguageProvider reads the stored language while rendering.
    const store = new Map<string, string>([['brifo_lang', 'ar']]);
    (globalThis as { localStorage?: unknown }).localStorage = {
      getItem: (k: string) => store.get(k) ?? null,
      setItem: (k: string, v: string) => void store.set(k, v),
      removeItem: (k: string) => void store.delete(k),
    };
  });

  const render = (mode: 'create' | 'edit') =>
    renderToStaticMarkup(
      <LanguageProvider>
        <ChildForm mode={mode} initialName="علاء" initialClass="3B" initialSchool="Volksschule Linz" onSave={() => {}} />
      </LanguageProvider>,
    );

  it('does not ask for consent again', () => {
    expect(render('edit')).not.toContain('type="checkbox"');
  });

  it('still asks for it when a profile is being created', () => {
    expect(render('create')).toContain('type="checkbox"');
  });

  it('opens with the details already in it, so only the wrong one is retyped', () => {
    const html = render('edit');
    expect(html).toContain('value="علاء"');
    expect(html).toContain('value="3B"');
    expect(html).toContain('value="Volksschule Linz"');
  });
});
