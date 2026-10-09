# Tests

`npm test` runs everything (about a second and a half); `npm run test:watch`
re-runs on save. No network, no secrets, no database — Supabase, KV, Stripe
and web-push are all stubbed, so these pass on a fresh clone.

What is covered, and why these and not others:

| File | Guards |
| --- | --- |
| `entitlement.test.ts` | The server-side paywall: who may scan, the seven-day trial, referral bonus days, an active subscription, the daily ceiling, and the test/live Stripe split. Every pass through it spends money. |
| `reminders.test.ts` | Reminder delivery: anchoring an appointment to a real instant in Vienna across both daylight-saving switches, and the once-a-day cron deciding what is due, what it already sent, and when to drop a dead device. |
| `guideData.test.ts` | The 22 guide articles in six languages plus the feminine Arabic variant: complete, ordered, non-empty, every bold marker closed, an icon per article, and the same official source cited in every language. |
| `translations.test.ts` | The six translation tables: no empty strings, and every `{placeholder}` surviving translation — the type system checks the keys, not the insides of the strings. |
| `botText.test.ts` | What the Telegram bot says in six languages: nothing missing, nothing left in Arabic, nothing past Telegram's message limit or too wide for a phone button. |
| `constantsInSync.test.ts` | The values that exist twice because CommonJS (`api/`, `src/server/`) cannot import the browser-side ESM tree. A test is the only thing here that can see both sides at once. |
| `bidiText.test.tsx` | Latin and numeric runs inside Arabic text — amounts, times, dates, German words. Getting the boundaries wrong renders `Meldebestätigung` as `tigungäMeldebest`. |

The suite was checked against twelve deliberate bugs (a 14-day trial, the
Vienna offset applied backwards, a dropped `{count}`, an unapplied feminine
override, a source link in one language only, and so on). All twelve failed a
test, which is the only evidence that a green run means anything.
