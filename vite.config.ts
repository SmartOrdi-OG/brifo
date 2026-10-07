import { defineConfig, loadEnv, type Plugin, type Connect } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

function jsonPostRoute(
  handler: (body: unknown, req: import('node:http').IncomingMessage) => Promise<{ status: number; body: unknown }>,
): Connect.SimpleHandleFunction {
  return (req, res) => {
    if (req.method !== 'POST') {
      res.statusCode = 405
      res.end(JSON.stringify({ error: 'method not allowed' }))
      return
    }

    let raw = ''
    req.on('data', (chunk) => (raw += chunk))
    req.on('end', async () => {
      res.setHeader('Content-Type', 'application/json')
      try {
        const body = JSON.parse(raw || '{}')
        const { status, body: responseBody } = await handler(body, req)
        res.statusCode = status
        res.end(JSON.stringify(responseBody))
      } catch {
        res.statusCode = 400
        res.end(JSON.stringify({ error: 'invalid request body' }))
      }
    })
  }
}

type VercelHandler = (req: never, res: never) => void | Promise<void>

/** api/ is a CommonJS corner of the project (api/package.json says so, because
 * that is what Vercel's functions want) while this config is ESM, so the
 * `default` of an api/ module arrives wrapped one level deeper in some
 * loaders and not in others. Unwrap whichever shape turned up rather than
 * guessing one and crashing dev on the other. */
function interopHandler(mod: unknown): VercelHandler {
  const outer = (mod as { default?: unknown }).default
  if (typeof outer === 'function') return outer as VercelHandler
  const inner = (outer as { default?: unknown } | undefined)?.default
  if (typeof inner === 'function') return inner as VercelHandler
  throw new Error('api module has no default export')
}

/** Runs a real handler out of api/ in dev, instead of a second copy of the
 * same logic written against the server modules.
 *
 * The second copy is what this solves. /api/analyze had one, it was never
 * updated when the deployed route gained non-school senders, six output
 * languages and the entitlement check, and so `npm run dev` quietly kept
 * answering with the old Arabic-school-only prompt and no paywall. A dev
 * route that *is* the production route cannot drift that way.
 *
 * Vercel hands a handler a parsed `body`, a `query` and a response carrying
 * status()/json(); Connect gives none of those, so this fills them in. Note
 * that gated routes are genuinely gated here too: scanning locally needs the
 * Supabase env vars set, exactly as in production. */
function vercelDevRoute(
  load: () => Promise<unknown>,
  query: Record<string, string> = {},
): Connect.SimpleHandleFunction {
  return (req, res) => {
    let raw = ''
    req.on('data', (chunk) => (raw += chunk))
    req.on('end', async () => {
      const vercelRes = Object.assign(res, {
        status(code: number) {
          res.statusCode = code
          return vercelRes
        },
        json(body: unknown) {
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify(body))
        },
      })

      let body: unknown
      try {
        body = raw ? JSON.parse(raw) : {}
      } catch {
        vercelRes.status(400).json({ error: 'invalid request body' })
        return
      }

      try {
        const handler = interopHandler(await load())
        await handler(Object.assign(req, { body, query }) as never, vercelRes as never)
      } catch (err) {
        console.error('dev api route failed', err)
        if (!res.writableEnded) vercelRes.status(500).json({ error: 'unexpected error' })
      }
    })
  }
}

function apiDevMiddleware(): Plugin {
  return {
    name: 'brifo-api-dev-middleware',
    configureServer(server) {
      server.middlewares.use('/api/analyze', vercelDevRoute(() => import('./api/analyze.ts')))

      server.middlewares.use('/api/reply', vercelDevRoute(() => import('./api/reply.ts')))

      // The ?action= values match the rewrites in vercel.json.
      for (const action of ['public-key', 'subscribe', 'unsubscribe', 'sync'] as const) {
        server.middlewares.use(`/api/push-${action}`, vercelDevRoute(() => import('./api/push.ts'), { action }))
      }

      server.middlewares.use(
        '/api/backup-sync',
        jsonPostRoute(async (body, req) => {
          const { saveCloudBackup } = await import('./src/server/backup.ts')
          const { getUserFromRequest } = await import('./src/server/auth.ts')
          const user = await getUserFromRequest(req)
          if (!user) return { status: 401, body: { error: 'not signed in' } }
          const { data } = (body ?? {}) as { data?: unknown }
          if (!data || typeof data !== 'object') return { status: 400, body: { error: 'invalid request' } }
          await saveCloudBackup(user.id, data)
          return { status: 200, body: { ok: true } }
        }),
      )

      server.middlewares.use(
        '/api/backup-restore',
        jsonPostRoute(async (_body, req) => {
          const { loadCloudBackup } = await import('./src/server/backup.ts')
          const { getUserFromRequest } = await import('./src/server/auth.ts')
          const user = await getUserFromRequest(req)
          if (!user) return { status: 401, body: { error: 'not signed in' } }
          const backup = await loadCloudBackup(user.id)
          if (!backup) return { status: 404, body: { error: 'not found' } }
          return { status: 200, body: backup }
        }),
      )

      server.middlewares.use(
        '/api/consent-accept',
        jsonPostRoute(async (body, req) => {
          const { saveConsentRecord } = await import('./src/server/consent.ts')
          const { getUserFromRequest } = await import('./src/server/auth.ts')
          const user = await getUserFromRequest(req)
          if (!user) return { status: 401, body: { error: 'not signed in' } }
          const { version, acceptedAt } = (body ?? {}) as { version?: unknown; acceptedAt?: unknown }
          if (typeof version !== 'number' || typeof acceptedAt !== 'string' || Number.isNaN(Date.parse(acceptedAt))) {
            return { status: 400, body: { error: 'invalid consent record' } }
          }
          await saveConsentRecord(user.id, { email: user.email, version, acceptedAt, recordedAt: new Date().toISOString() })
          return { status: 200, body: { ok: true } }
        }),
      )

      server.middlewares.use(
        '/api/rating-submit',
        jsonPostRoute(async (body) => {
          const { submitRating } = await import('./src/server/ratings.ts')
          const { stars, comment, lang } = (body ?? {}) as { stars?: unknown; comment?: unknown; lang?: unknown }
          if (typeof stars !== 'number' || !Number.isInteger(stars) || stars < 1 || stars > 5) {
            return { status: 400, body: { error: 'invalid stars' } }
          }
          await submitRating(stars, typeof comment === 'string' ? comment : '', lang === 'de' ? 'de' : lang === 'tr' ? 'tr' : lang === 'fa' ? 'fa' : lang === 'en' ? 'en' : lang === 'uk' ? 'uk' : 'ar')
          return { status: 200, body: { ok: true } }
        }),
      )

      server.middlewares.use(
        '/api/admin/ratings',
        jsonPostRoute(async (body) => {
          const { listRatings } = await import('./src/server/ratings.ts')
          const { secret } = (body ?? {}) as { secret?: unknown }
          const expected = process.env.ADMIN_SECRET
          if (expected && secret !== expected) return { status: 401, body: { error: 'unauthorized' } }
          const ratings = await listRatings()
          return { status: 200, body: { ratings } }
        }),
      )

      server.middlewares.use(
        '/api/create-checkout-session',
        jsonPostRoute(async (body, req) => {
          const { createCheckoutSession } = await import('./src/server/stripe.ts')
          const { getUserFromRequest } = await import('./src/server/auth.ts')
          const { ConfigError } = await import('./src/server/errors.ts')
          const user = await getUserFromRequest(req)
          if (!user) return { status: 401, body: { error: 'unauthorized' } }
          const { origin, plan } = (body ?? {}) as { origin?: unknown; plan?: unknown }
          const base = typeof origin === 'string' ? origin : ''
          const selectedPlan = plan === 'annual' ? 'annual' : 'monthly'
          try {
            const url = await createCheckoutSession(
              user.id,
              user.email ?? '',
              `${base}/paywall?checkout=success`,
              `${base}/paywall?checkout=cancelled`,
              selectedPlan,
            )
            return { status: 200, body: { url } }
          } catch (err) {
            if (err instanceof ConfigError) return { status: 500, body: { error: `server misconfigured: ${err.message}` } }
            console.error('create-checkout-session failed', err)
            return { status: 500, body: { error: 'failed to create checkout session' } }
          }
        }),
      )

      server.middlewares.use(
        '/api/create-portal-session',
        jsonPostRoute(async (body, req) => {
          const { createBillingPortalSession } = await import('./src/server/stripe.ts')
          const { getUserFromRequest } = await import('./src/server/auth.ts')
          const { ConfigError } = await import('./src/server/errors.ts')
          const user = await getUserFromRequest(req)
          if (!user) return { status: 401, body: { error: 'unauthorized' } }
          const { origin } = (body ?? {}) as { origin?: unknown }
          const base = typeof origin === 'string' ? origin : ''
          try {
            const url = await createBillingPortalSession(user.id, user.email ?? '', `${base}/settings`)
            return { status: 200, body: { url } }
          } catch (err) {
            if (err instanceof ConfigError) return { status: 500, body: { error: `server misconfigured: ${err.message}` } }
            console.error('create-portal-session failed', err)
            return { status: 500, body: { error: 'failed to create billing portal session' } }
          }
        }),
      )

      server.middlewares.use(
        '/api/subscription-status',
        jsonPostRoute(async (_body, req) => {
          const { getSubscriptionStatus } = await import('./src/server/stripe.ts')
          const { getUserFromRequest } = await import('./src/server/auth.ts')
          const { isComplimentaryEmail } = await import('./src/server/freeAccounts.ts')
          const { getBonusTrialDays } = await import('./src/server/referral.ts')
          const user = await getUserFromRequest(req)
          if (!user) return { status: 401, body: { error: 'unauthorized' } }
          const bonusTrialDays = await getBonusTrialDays(user.id)
          if (isComplimentaryEmail(user.email)) return { status: 200, body: { active: true, currentPeriodEnd: null, bonusTrialDays } }
          const status = await getSubscriptionStatus(user.id)
          return { status: 200, body: { ...status, bonusTrialDays } }
        }),
      )

      server.middlewares.use(
        '/api/redeem-referral',
        jsonPostRoute(async (body, req) => {
          const { getUserFromRequest } = await import('./src/server/auth.ts')
          const { redeemReferral } = await import('./src/server/referral.ts')
          const user = await getUserFromRequest(req)
          if (!user) return { status: 401, body: { error: 'unauthorized' } }
          const { referrerId } = (body ?? {}) as { referrerId?: unknown }
          if (typeof referrerId !== 'string' || !referrerId) return { status: 400, body: { error: 'missing referrerId' } }
          const result = await redeemReferral(user.id, referrerId)
          return { status: 200, body: result }
        }),
      )

      // Reachable locally through a tunnel (e.g. `ngrok http 5173`) pointed at
      // by setWebhook, so the bot can be driven from a real Telegram client
      // without deploying. Same secret-header check as the deployed route.
      server.middlewares.use(
        '/api/telegram',
        jsonPostRoute(async (body, req) => {
          const { handleUpdate } = await import('./src/server/telegram.ts')
          const expected = process.env.TELEGRAM_WEBHOOK_SECRET
          if (!expected || req.headers['x-telegram-bot-api-secret-token'] !== expected) {
            return { status: 401, body: { error: 'unauthorized' } }
          }
          try {
            await handleUpdate(body as Parameters<typeof handleUpdate>[0])
          } catch (err) {
            console.error('telegram update failed', err)
          }
          return { status: 200, body: { ok: true } }
        }),
      )

      server.middlewares.use('/api/cron/send-reminders', async (_req, res) => {
        const { runDueReminders } = await import('./src/server/push.ts')
        res.setHeader('Content-Type', 'application/json')
        try {
          const result = await runDueReminders(20)
          res.end(JSON.stringify({ ok: true, ...result }))
        } catch (err) {
          res.statusCode = 500
          res.end(JSON.stringify({ error: err instanceof Error ? err.message : 'unexpected error' }))
        }
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const passthroughEnvVars = [
    'ANTHROPIC_API_KEY',
    'VAPID_PUBLIC_KEY',
    'VAPID_PRIVATE_KEY',
    'VAPID_SUBJECT',
    'KV_REST_API_URL',
    'KV_REST_API_TOKEN',
    'CRON_SECRET',
    'ADMIN_SECRET',
    'VITE_SUPABASE_URL',
    'VITE_SUPABASE_ANON_KEY',
    'STRIPE_SECRET_KEY',
    'STRIPE_PRICE_ID',
    'STRIPE_WEBHOOK_SECRET',
    'FREE_ACCOUNT_EMAILS',
    'TELEGRAM_BOT_TOKEN',
    'TELEGRAM_WEBHOOK_SECRET',
    'TELEGRAM_DAILY_SCAN_LIMIT',
    'PUBLIC_BASE_URL',
  ]
  for (const key of passthroughEnvVars) {
    // Assigning `undefined` to process.env[key] would coerce it to the
    // string "undefined" (Node's env store is string-only) — worse than
    // just leaving the key unset.
    const value = process.env[key] || env[key]
    if (value) process.env[key] = value
  }

  return {
    plugins: [
      react(),
      apiDevMiddleware(),
      VitePWA({
        registerType: 'autoUpdate',
        strategies: 'injectManifest',
        srcDir: 'src',
        filename: 'sw.ts',
        injectManifest: {
          globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],
        },
        // Lets `npm run dev` register a real service worker too, so push
        // notifications (which need one) are testable without a full build.
        devOptions: {
          enabled: true,
          type: 'module',
        },
        includeAssets: ['icons/icon.svg'],
        manifest: {
          name: 'Brifo — بريفو',
          short_name: 'Brifo',
          description:
            'يساعد الأهل الناطقين بالعربي في النمسا على فهم رسائل المدرسة، معرفة المواعيد، وكتابة الردود بالألماني.',
          lang: 'ar',
          dir: 'rtl',
          start_url: '/',
          scope: '/',
          display: 'standalone',
          background_color: '#f5f6fb',
          theme_color: '#f5f6fb',
          icons: [
            {
              src: '/icons/icon-192-v2.png',
              sizes: '192x192',
              type: 'image/png',
            },
            {
              src: '/icons/icon-512-v2.png',
              sizes: '512x512',
              type: 'image/png',
            },
            {
              src: '/icons/icon-512-maskable-v2.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable',
            },
          ],
        },
      }),
    ],
  }
})
