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

function apiDevMiddleware(): Plugin {
  return {
    name: 'brifo-api-dev-middleware',
    configureServer(server) {
      server.middlewares.use(
        '/api/analyze',
        jsonPostRoute(async (body) => {
          const { image, mediaType } = (body ?? {}) as { image?: string; mediaType?: string }
          const { analyzeLetterImage, AnalyzeError } = await import('./src/server/analyze.ts')
          try {
            if (!image || !mediaType) throw new AnalyzeError('missing image or mediaType')
            const result = await analyzeLetterImage(image, mediaType)
            return { status: 200, body: result }
          } catch (err) {
            if (err instanceof AnalyzeError) return { status: 400, body: { error: err.message } }
            console.error('analyze failed', err)
            return { status: 500, body: { error: 'analysis failed' } }
          }
        }),
      )

      server.middlewares.use(
        '/api/reply',
        jsonPostRoute(async (body) => {
          const { generateReplyLetter, ReplyError } = await import('./src/server/reply.ts')
          try {
            const result = await generateReplyLetter(body)
            return { status: 200, body: result }
          } catch (err) {
            if (err instanceof ReplyError) return { status: 400, body: { error: err.message } }
            console.error('reply generation failed', err)
            return { status: 500, body: { error: 'reply generation failed' } }
          }
        }),
      )

      server.middlewares.use('/api/push-public-key', async (req, res) => {
        if (req.method !== 'GET') {
          res.statusCode = 405
          res.end(JSON.stringify({ error: 'method not allowed' }))
          return
        }
        const { getVapidPublicKey } = await import('./src/server/push.ts')
        res.setHeader('Content-Type', 'application/json')
        try {
          res.end(JSON.stringify({ publicKey: getVapidPublicKey() }))
        } catch (err) {
          res.statusCode = 500
          res.end(JSON.stringify({ error: err instanceof Error ? err.message : 'unexpected error' }))
        }
      })

      server.middlewares.use(
        '/api/push-subscribe',
        jsonPostRoute(async (body) => {
          const { saveSubscription } = await import('./src/server/push.ts')
          const { deviceId, subscription } = (body ?? {}) as { deviceId?: string; subscription?: unknown }
          if (!deviceId || !subscription) return { status: 400, body: { error: 'invalid request' } }
          await saveSubscription(deviceId, subscription as never)
          return { status: 200, body: { ok: true } }
        }),
      )

      server.middlewares.use(
        '/api/push-unsubscribe',
        jsonPostRoute(async (body) => {
          const { removeSubscription } = await import('./src/server/push.ts')
          const { deviceId } = (body ?? {}) as { deviceId?: string }
          if (!deviceId) return { status: 400, body: { error: 'missing deviceId' } }
          await removeSubscription(deviceId)
          return { status: 200, body: { ok: true } }
        }),
      )

      server.middlewares.use(
        '/api/push-sync',
        jsonPostRoute(async (body) => {
          const { syncReminders } = await import('./src/server/push.ts')
          const { deviceId, events, offsets, lang } = (body ?? {}) as {
            deviceId?: string
            events?: never[]
            offsets?: number[]
            lang?: 'ar' | 'de'
          }
          if (!deviceId || !events || !offsets) return { status: 400, body: { error: 'invalid request' } }
          await syncReminders(deviceId, events, offsets, lang === 'de' ? 'de' : 'ar')
          return { status: 200, body: { ok: true } }
        }),
      )

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
          await submitRating(stars, typeof comment === 'string' ? comment : '', lang === 'de' ? 'de' : 'ar')
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
        '/api/subscription-status',
        jsonPostRoute(async (_body, req) => {
          const { getSubscriptionStatus } = await import('./src/server/stripe.ts')
          const { getUserFromRequest } = await import('./src/server/auth.ts')
          const { isComplimentaryEmail } = await import('./src/server/freeAccounts.ts')
          const user = await getUserFromRequest(req)
          if (!user) return { status: 401, body: { error: 'unauthorized' } }
          if (isComplimentaryEmail(user.email)) return { status: 200, body: { active: true, currentPeriodEnd: null } }
          const status = await getSubscriptionStatus(user.id)
          return { status: 200, body: status }
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
              src: '/icons/icon-192.png',
              sizes: '192x192',
              type: 'image/png',
            },
            {
              src: '/icons/icon-512.png',
              sizes: '512x512',
              type: 'image/png',
            },
            {
              src: '/icons/icon-512-maskable.png',
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
