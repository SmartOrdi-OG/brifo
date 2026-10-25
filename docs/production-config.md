# What production needs set, and where

Every one of these lives in Vercel → the Brifo project → Settings →
Environment Variables, scoped to **Production**. None of them is in the
repository, and most of them fail quietly when missing — so after changing
anything here, open `/admin` → **Configuration** and confirm it reads green.
That screen asks each service directly; this file says what each one is for.

## Required — a user hits this the same day

| Variable | What breaks without it |
|---|---|
| `ANTHROPIC_API_KEY` | Scanning a letter fails. Nothing else in the app does. |
| `VITE_SUPABASE_URL` | Nobody can sign in — it is the first screen. |
| `VITE_SUPABASE_ANON_KEY` | Same. |
| `KV_REST_API_URL` | **Silent.** `src/server/kv.ts` falls back to an in-process `Map`: reminders, subscription records, ratings and the error log are accepted and then discarded between invocations. |
| `KV_REST_API_TOKEN` | Same, and a *wrong* token behaves identically to a missing one. |
| `ADMIN_SECRET` | `/admin` refuses every password — it fails closed on purpose. |
| `CRON_SECRET` | The daily reminder run cannot authenticate, so no reminder is ever sent. |

### Push reminders

| Variable | Notes |
|---|---|
| `VAPID_PUBLIC_KEY` | 87–88 characters. A truncated paste is accepted at startup and only rejected hours later, when a reminder was due. |
| `VAPID_PRIVATE_KEY` | 43–44 characters. |
| `VAPID_SUBJECT` | Must start with `mailto:` or `https://`. |

### Payment

| Variable | Notes |
|---|---|
| `STRIPE_SECRET_KEY` | **Check the mode.** A `sk_test_…` / `rk_test_…` key works, looks healthy, and charges nobody. Live mode needs `sk_live_…`. |
| `STRIPE_WEBHOOK_SECRET` | Starts with `whsec_`. Without it a paid subscriber is never recorded and stays locked out — the one failure in the app that takes money and gives nothing. `resolveSubscriptionStatus()` in `src/server/stripe.ts` recovers from this by asking Stripe directly, but that is a safety net, not a substitute. |
| `STRIPE_PRICE_ID` | Optional. Pins the monthly price to one created by hand; otherwise the price is created once and cached in KV. |

Stripe ids are mode-scoped, so every cached id is namespaced by mode
(`stripeMode()` in `src/server/stripeKeys.ts`). Switching test → live starts
from a clean slate rather than replaying ids Stripe will reject.

## Optional

| Variable | Notes |
|---|---|
| `FREE_ACCOUNT_EMAILS` | Comma-separated addresses that skip the paywall. |
| `ANALYZE_DAILY_LIMIT`, `REPLY_DAILY_LIMIT` | Per-user daily ceilings; defaults live in `src/server/entitlement.ts`. |
| `PUBLIC_BASE_URL` | Only needed if `VERCEL_URL` is not the public address. |

## Set by Vercel itself

`VERCEL_GIT_COMMIT_SHA` becomes `VITE_APP_VERSION` at build time (see
`vite.config.ts`), which is what the error log and the Configuration tab
report as the deployed version. If that shows a commit older than `main`, the
deployment did not pick up the latest merge.

## Supabase: sign-in email

Supabase's built-in mailer is shared across all its free projects and capped
at roughly **30 emails per hour**. Brifo sends a login code to every new
user, so on any day the app is actually promoted, sign-in codes start
silently not arriving — and this is the failure that looks like the app is
broken to someone who has never used it before.

The fix is custom SMTP, in Supabase → Project Settings → Authentication →
SMTP Settings:

| Field | Value |
|---|---|
| Host | `smtp.resend.com` |
| Port | `465` |
| Username | `resend` |
| Password | a Resend API key (`re_…`) |
| Sender email | an address at a domain verified in Resend |
| Sender name | `Brifo` |

The sender domain must be verified in Resend first (Resend → Domains → add
the domain, then the DKIM/SPF records it prints into DNS). Until it is
verified, Resend rejects the send and the code still does not arrive.

Hobby note: Vercel's Hobby plan caps a deployment at **12 serverless
functions** and **one cron run per day**. `api/` currently holds 9 files;
several of them serve multiple routes through `?action=` rewrites in
`vercel.json` for exactly this reason.
