/** In-app ratings (stars + optional comment) collected across all users so
 * the app owner can actually read them — see kv.ts for the storage backend.
 * Deliberately collects no identifying info (no device id, no name). */
import { kvGet, kvSet, kvSadd, kvSmembers, kvSrem } from './kv.js';

/** Ratings are kept for at most 24 months (privacy policy §8). The key
 * expires on its own in KV; the id left behind in the index is dropped the
 * next time the list is read. */
export const RATING_TTL_SECONDS = 730 * 24 * 60 * 60;

const RATINGS_SET = 'ratings:ids';
const ratingKey = (id: string) => `ratings:${id}`;

export interface StoredRating {
  id: string;
  stars: number;
  comment: string;
  lang: 'ar' | 'de' | 'tr' | 'fa' | 'en' | 'uk';
  createdAt: string;
}

export async function submitRating(stars: number, comment: string, lang: 'ar' | 'de' | 'tr' | 'fa' | 'en' | 'uk'): Promise<void> {
  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  const entry: StoredRating = { id, stars, comment, lang, createdAt: new Date().toISOString() };
  await kvSet(ratingKey(id), entry, RATING_TTL_SECONDS);
  await kvSadd(RATINGS_SET, id);
}

export async function listRatings(): Promise<StoredRating[]> {
  const ids = await kvSmembers(RATINGS_SET);
  const entries = await Promise.all(ids.map((id) => kvGet<StoredRating>(ratingKey(id))));
  await Promise.all(ids.filter((_, i) => entries[i] === null).map((id) => kvSrem(RATINGS_SET, id)));
  return entries.filter((e): e is StoredRating => e !== null).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}
