/** The config check, which is only useful if it is trustworthy.
 *
 * It has two jobs that pull against each other: say enough about a secret to
 * tell a truncated paste or a test-mode key from a healthy one, and never say
 * the secret. Getting that wrong turns the admin screen into the place the
 * keys leak from — so the central test here is the negative one: whatever is
 * in the environment, no value of it appears in any detail string.
 *
 * The rest pins the judgements the screen is there to make, above all the two
 * silent failures: KV falling back to memory (every write discarded) and a
 * Stripe key left in test mode (real cards charged nothing). Neither raises
 * an error anywhere in the app, so if this file stops asserting them nothing
 * else will. */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { checkConfig, type ConfigCheck } from '../src/server/configCheck';
import { translations, type Lang } from '../src/context/translations';

/** Every variable the check looks at, so each test starts from a known-empty
 * environment rather than inheriting the shell's. */
const WATCHED = [
  'KV_REST_API_URL',
  'KV_REST_API_TOKEN',
  'VITE_SUPABASE_URL',
  'VITE_SUPABASE_ANON_KEY',
  'VAPID_PUBLIC_KEY',
  'VAPID_PRIVATE_KEY',
  'VAPID_SUBJECT',
  'STRIPE_SECRET_KEY',
  'STRIPE_WEBHOOK_SECRET',
  'TELEGRAM_BOT_TOKEN',
  'TELEGRAM_WEBHOOK_SECRET',
  'ANTHROPIC_API_KEY',
  'CRON_SECRET',
  'VERCEL_GIT_COMMIT_SHA',
];

const saved: Record<string, string | undefined> = {};

beforeEach(() => {
  for (const name of WATCHED) {
    saved[name] = process.env[name];
    delete process.env[name];
  }
});

afterEach(() => {
  for (const name of WATCHED) {
    if (saved[name] === undefined) delete process.env[name];
    else process.env[name] = saved[name];
  }
  vi.unstubAllGlobals();
});

const find = (checks: ConfigCheck[], id: string): ConfigCheck => {
  const check = checks.find((c) => c.id === id);
  if (!check) throw new Error(`no check with id "${id}"`);
  return check;
};

/** A valid-looking P-256 keypair: the right lengths, not real keys. */
const VAPID_PUBLIC = 'B'.repeat(87);
const VAPID_PRIVATE = 'p'.repeat(43);

describe('the storage that fails silently', () => {
  it('fails when KV is unset, and says writes are lost', async () => {
    // The whole reason this screen exists. kv.ts keeps working without these
    // vars by writing to a Map that dies with the invocation, so reminders,
    // subscription records and ratings are all accepted and then dropped.
    const kv = find(await checkConfig(), 'kv');
    expect(kv.status).toBe('fail');
    expect(kv.detail).toMatch(/memory/i);
  });

  it('fails, rather than passing, when the token is wrong', async () => {
    process.env.KV_REST_API_URL = 'https://example-kv.upstash.io';
    process.env.KV_REST_API_TOKEN = 'wrong-token';
    // A present-but-rejected token reads as "configured" to any check that
    // only looks for the variable, which is why this one round-trips a key.
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: false, status: 401, text: async () => 'unauthorized' }),
    );
    const kv = find(await checkConfig(), 'kv');
    expect(kv.status).toBe('fail');
  });

  it('passes only when a written key reads back unchanged', async () => {
    process.env.KV_REST_API_URL = 'https://example-kv.upstash.io';
    process.env.KV_REST_API_TOKEN = 'token';
    // Mimic a store that accepts the write and returns something else — a
    // wrong-database mix-up, which presence checks cannot see at all.
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: true, json: async () => ({ result: JSON.stringify('not-the-stamp') }) }),
    );
    const kv = find(await checkConfig(), 'kv');
    expect(kv.status).toBe('fail');
  });
});

describe('the Stripe key that takes no money', () => {
  it('warns on a test-mode key, naming the consequence', async () => {
    process.env.STRIPE_SECRET_KEY = 'sk_test_abc123';
    const key = find(await checkConfig(), 'stripe_key');
    // Not ok: a test key is a working key that charges nobody. Not fail
    // either — in a preview deployment it is correct.
    expect(key.status).toBe('warn');
    expect(key.detail).toMatch(/TEST/);
  });

  it('treats a restricted test key as test mode too', async () => {
    process.env.STRIPE_SECRET_KEY = 'rk_test_abc123';
    expect(find(await checkConfig(), 'stripe_key').status).toBe('warn');
  });

  it('fails when there is no key at all', async () => {
    const checks = await checkConfig();
    expect(find(checks, 'stripe_key').status).toBe('fail');
    expect(find(checks, 'stripe_webhook').status).toBe('fail');
  });
});

describe('the webhook secret, whose absence locks paying users out', () => {
  it('fails when unset', async () => {
    process.env.STRIPE_SECRET_KEY = 'sk_test_abc123';
    expect(find(await checkConfig(), 'stripe_webhook').status).toBe('fail');
  });

  it('fails on a secret that is not a signing secret', async () => {
    process.env.STRIPE_SECRET_KEY = 'sk_test_abc123';
    // Pasting the API key, or a restricted key, into this slot is the common
    // mistake; both are "set" and neither verifies a signature.
    process.env.STRIPE_WEBHOOK_SECRET = 'sk_live_not_a_webhook_secret';
    const check = find(await checkConfig(), 'stripe_webhook');
    expect(check.status).toBe('fail');
    expect(check.detail).toMatch(/whsec_/);
  });

  it('passes on a whsec_ secret, reporting only its length', async () => {
    process.env.STRIPE_SECRET_KEY = 'sk_test_abc123';
    process.env.STRIPE_WEBHOOK_SECRET = `whsec_${'x'.repeat(32)}`;
    const check = find(await checkConfig(), 'stripe_webhook');
    expect(check.status).toBe('ok');
    expect(check.detail).toContain('chars');
  });
});

describe('the VAPID keys, which only fail hours later on a phone', () => {
  it('fails when any of the three is missing, and names which', async () => {
    process.env.VAPID_PUBLIC_KEY = VAPID_PUBLIC;
    const check = find(await checkConfig(), 'vapid');
    expect(check.status).toBe('fail');
    expect(check.detail).toContain('VAPID_PRIVATE_KEY');
    expect(check.detail).toContain('VAPID_SUBJECT');
    expect(check.detail).not.toContain('VAPID_PUBLIC_KEY');
  });

  it('catches a truncated key by its length', async () => {
    // web-push accepts these at configure time and only rejects them when it
    // actually sends, which is the one moment nobody is looking.
    process.env.VAPID_PUBLIC_KEY = 'B'.repeat(40);
    process.env.VAPID_PRIVATE_KEY = VAPID_PRIVATE;
    process.env.VAPID_SUBJECT = 'mailto:team@example.com';
    const check = find(await checkConfig(), 'vapid');
    expect(check.status).toBe('fail');
    expect(check.detail).toMatch(/87-88/);
  });

  it('rejects a subject that is neither mailto: nor https:', async () => {
    process.env.VAPID_PUBLIC_KEY = VAPID_PUBLIC;
    process.env.VAPID_PRIVATE_KEY = VAPID_PRIVATE;
    process.env.VAPID_SUBJECT = 'team@example.com'; // missing mailto:
    const check = find(await checkConfig(), 'vapid');
    expect(check.status).toBe('fail');
    expect(check.detail).toMatch(/mailto:/);
  });

  it('passes a well-formed set', async () => {
    process.env.VAPID_PUBLIC_KEY = VAPID_PUBLIC;
    process.env.VAPID_PRIVATE_KEY = VAPID_PRIVATE;
    process.env.VAPID_SUBJECT = 'mailto:team@example.com';
    expect(find(await checkConfig(), 'vapid').status).toBe('ok');
  });
});

describe('Telegram, which is optional but not half-optional', () => {
  it('warns when the bot is simply off', async () => {
    const check = find(await checkConfig(), 'telegram');
    expect(check.status).toBe('warn');
  });

  it('fails when only one of the two is set', async () => {
    // Half-configured is worse than off: the bot answers and every update
    // fails its secret check, silently.
    process.env.TELEGRAM_BOT_TOKEN = '123456:fake-token-for-tests';
    const check = find(await checkConfig(), 'telegram');
    expect(check.status).toBe('fail');
    expect(check.detail).toContain('TELEGRAM_WEBHOOK_SECRET');
  });

  it('passes when both are set', async () => {
    process.env.TELEGRAM_BOT_TOKEN = '123456:fake-token-for-tests';
    process.env.TELEGRAM_WEBHOOK_SECRET = 'webhook-secret';
    expect(find(await checkConfig(), 'telegram').status).toBe('ok');
  });
});

describe('the rest of the required set', () => {
  it('fails on a missing Anthropic key, and does not spend credit checking', async () => {
    const missing = find(await checkConfig(), 'anthropic');
    expect(missing.status).toBe('fail');

    process.env.ANTHROPIC_API_KEY = 'sk-ant-fake';
    const present = find(await checkConfig(), 'anthropic');
    expect(present.status).toBe('ok');
    // If this ever starts making a real call, every load of the admin screen
    // costs money. The detail says so out loud.
    expect(present.detail).toMatch(/not called/);
  });

  it('fails on a missing CRON_SECRET, which would stop the daily reminders', async () => {
    expect(find(await checkConfig(), 'cron').status).toBe('fail');
    process.env.CRON_SECRET = 'cron-secret';
    expect(find(await checkConfig(), 'cron').status).toBe('ok');
  });

  it('fails when Supabase is unconfigured, because that is the first screen', async () => {
    const check = find(await checkConfig(), 'supabase');
    expect(check.status).toBe('fail');
    expect(check.detail).toContain('VITE_SUPABASE_URL');
  });

  describe('asking Supabase whether it is healthy', () => {
    const configureSupabase = () => {
      process.env.VITE_SUPABASE_URL = 'https://example.supabase.co';
      process.env.VITE_SUPABASE_ANON_KEY = 'anon-key';
    };

    it('sends the anon key, because the gateway rejects a bare request', async () => {
      // The bug this covers: hosted Supabase puts /auth/v1/* behind a gateway
      // that 401s any request without an apikey header, so the first version
      // of this check reported a working sign-in as broken on a live project.
      configureSupabase();
      const fetchMock = vi.fn().mockResolvedValue({ ok: true, status: 200 });
      vi.stubGlobal('fetch', fetchMock);

      const check = find(await checkConfig(), 'supabase');
      expect(check.status).toBe('ok');

      const [requestUrl, init] = fetchMock.mock.calls[0];
      expect(requestUrl).toBe('https://example.supabase.co/auth/v1/health');
      expect((init as { headers: Record<string, string> }).headers.apikey).toBe('anon-key');
    });

    it('does not double the slash when the URL has a trailing one', async () => {
      process.env.VITE_SUPABASE_URL = 'https://example.supabase.co/';
      process.env.VITE_SUPABASE_ANON_KEY = 'anon-key';
      const fetchMock = vi.fn().mockResolvedValue({ ok: true, status: 200 });
      vi.stubGlobal('fetch', fetchMock);

      await checkConfig();
      expect(fetchMock.mock.calls[0][0]).toBe('https://example.supabase.co/auth/v1/health');
    });

    it('now reads a 401 as a rejected key, which is a real fault', async () => {
      configureSupabase();
      vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 401 }));
      const check = find(await checkConfig(), 'supabase');
      expect(check.status).toBe('fail');
      expect(check.detail).toMatch(/rejected/i);
    });

    it('separates a wrong URL from a wrong key', async () => {
      // No response at all: a typo, or a paused or deleted project. The
      // wording has to send the reader somewhere different than a 401 does.
      configureSupabase();
      vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('getaddrinfo ENOTFOUND')));
      const check = find(await checkConfig(), 'supabase');
      expect(check.status).toBe('fail');
      expect(check.detail).toMatch(/unreachable/i);
    });
  });

  it('reports the deployed commit, so a stale deployment is visible', async () => {
    process.env.VERCEL_GIT_COMMIT_SHA = 'abcdef1234567890';
    expect(find(await checkConfig(), 'version').detail).toBe('abcdef1');
  });
});

describe('never leaking what it is checking', () => {
  it('puts no secret value in any detail, whatever the status', async () => {
    // The point of the whole file. These are distinctive strings; if any one
    // of them reaches the screen, the admin page has become the leak.
    const secrets = {
      KV_REST_API_TOKEN: 'kv-token-SENTINEL-1',
      VITE_SUPABASE_ANON_KEY: 'anon-key-SENTINEL-2',
      VAPID_PRIVATE_KEY: 'v'.repeat(43),
      VAPID_PUBLIC_KEY: 'B'.repeat(87),
      STRIPE_SECRET_KEY: 'sk_test_SENTINEL_3',
      STRIPE_WEBHOOK_SECRET: 'not_a_whsec_SENTINEL_4',
      TELEGRAM_BOT_TOKEN: '999:SENTINEL-5',
      ANTHROPIC_API_KEY: 'sk-ant-SENTINEL-6',
      CRON_SECRET: 'cron-SENTINEL-7',
    };
    Object.assign(process.env, secrets);
    process.env.KV_REST_API_URL = 'https://example-kv.upstash.io';
    process.env.VITE_SUPABASE_URL = 'https://example.supabase.co';
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline in tests')));

    const checks = await checkConfig();
    const everything = checks.map((c) => c.detail).join('\n');

    for (const [name, value] of Object.entries(secrets)) {
      expect(everything, `${name} leaked into a detail`).not.toContain(value);
    }
    // Variable *names* are the useful part and must still come through.
    expect(everything).toContain('whsec_');
  });

  it('reports a status and a non-empty detail for every check', async () => {
    const checks = await checkConfig();
    expect(checks.length).toBeGreaterThan(0);
    for (const check of checks) {
      expect(['ok', 'warn', 'fail'], check.id).toContain(check.status);
      expect(check.detail.trim(), `${check.id} has no detail`).not.toBe('');
    }
  });

  it('has a label in every language for every check it returns', async () => {
    // The screen looks each row's label up as `admin_config_<id>`. A check
    // added on the server without its six labels renders the raw key — in
    // Arabic, to the one person who reads this screen. The two sides live in
    // different module scopes (api/ is commonjs, src/context is not), so a
    // test is the only place they can be compared.
    const ids = (await checkConfig()).map((c) => c.id);
    const langs = Object.keys(translations) as Lang[];
    for (const id of ids) {
      for (const lang of langs) {
        const key = `admin_config_${id}` as keyof (typeof translations)[Lang];
        expect(translations[lang][key], `${lang} has no label for "${id}"`).toBeTruthy();
      }
    }
  });

  it('gives every check a distinct id, so the screen cannot drop a row', async () => {
    // Each row is looked up by id for its label; a duplicate would render
    // twice and hide whatever it collided with.
    const ids = (await checkConfig()).map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
