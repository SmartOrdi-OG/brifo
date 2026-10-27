/** The only thing standing in front of /admin.
 *
 * That screen is deliberately reachable without signing in — it reports
 * whether sign-in works, so it cannot sit behind sign-in — and it shows the
 * ratings people left, the error log with its stack traces, and the name and
 * state of every service the deployment talks to. The password is the whole
 * of the protection.
 *
 * Which makes two things worth pinning. The ceiling, because without it a
 * list of likely passwords can be worked through at request speed. And the
 * reset on success, because the admin screen re-sends the password on every
 * tab switch and every press of the refresh button, so a ceiling that counted
 * correct requests would lock the operator out of their own screen after a
 * few minutes of normal use — a bug that would look exactly like an attack.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { authorizeAdmin, adminAuthStatus } from '../src/server/adminAuth';

const SECRET = 'correct-horse-battery-staple';
const FROM = (ip: string) => ({ 'x-forwarded-for': ip });

let savedSecret: string | undefined;
/** Each test gets its own address, so the shared KV counter in one test
 * cannot bleed into the next. */
let addressCounter = 0;
const freshAddress = () => `203.0.113.${(addressCounter += 1)}`;

beforeEach(() => {
  savedSecret = process.env.ADMIN_SECRET;
  process.env.ADMIN_SECRET = SECRET;
});

afterEach(() => {
  if (savedSecret === undefined) delete process.env.ADMIN_SECRET;
  else process.env.ADMIN_SECRET = savedSecret;
  vi.restoreAllMocks();
});

describe('the password itself', () => {
  it('accepts the right one', async () => {
    expect(await authorizeAdmin(SECRET, FROM(freshAddress()))).toBe('ok');
  });

  it('rejects a wrong one, a prefix of it, and a non-string', async () => {
    const ip = freshAddress();
    expect(await authorizeAdmin('wrong', FROM(ip))).toBe('wrong-secret');
    expect(await authorizeAdmin(SECRET.slice(0, -1), FROM(freshAddress()))).toBe('wrong-secret');
    expect(await authorizeAdmin(undefined, FROM(freshAddress()))).toBe('wrong-secret');
    expect(await authorizeAdmin(42, FROM(freshAddress()))).toBe('wrong-secret');
  });

  it('rejects a longer string that starts with the secret', async () => {
    // Buffer comparison has to be length-checked first; timingSafeEqual
    // throws on a length mismatch rather than returning false.
    expect(await authorizeAdmin(`${SECRET}extra`, FROM(freshAddress()))).toBe('wrong-secret');
  });

  it('fails closed when ADMIN_SECRET is unset', async () => {
    // The endpoints only run deployed, so this means a misconfigured
    // deployment. Treating it as "allow" would publish the whole screen.
    delete process.env.ADMIN_SECRET;
    expect(await authorizeAdmin('anything', FROM(freshAddress()))).toBe('not-configured');
    expect(await authorizeAdmin('', FROM(freshAddress()))).toBe('not-configured');
  });
});

describe('the attempt ceiling', () => {
  it('allows five wrong guesses, then shuts the address out', async () => {
    const ip = freshAddress();
    for (let i = 0; i < 5; i += 1) {
      expect(await authorizeAdmin('wrong', FROM(ip)), `guess ${i + 1}`).toBe('wrong-secret');
    }
    expect(await authorizeAdmin('wrong', FROM(ip))).toBe('rate-limited');
  });

  it('shuts out the right password too, once the ceiling is reached', async () => {
    // Otherwise the response tells an attacker when they have found it, and
    // the ceiling protects nothing.
    const ip = freshAddress();
    for (let i = 0; i < 6; i += 1) await authorizeAdmin('wrong', FROM(ip));
    expect(await authorizeAdmin(SECRET, FROM(ip))).toBe('rate-limited');
  });

  it('counts each address separately', async () => {
    const attacker = freshAddress();
    for (let i = 0; i < 6; i += 1) await authorizeAdmin('wrong', FROM(attacker));
    expect(await authorizeAdmin('wrong', FROM(attacker))).toBe('rate-limited');
    // The operator, elsewhere, is unaffected.
    expect(await authorizeAdmin(SECRET, FROM(freshAddress()))).toBe('ok');
  });

  it('takes the client from the front of an x-forwarded-for chain', async () => {
    // The rest of the chain is proxies; counting against the last entry
    // would put every visitor in one bucket.
    const client = freshAddress();
    const chain = { 'x-forwarded-for': `${client}, 70.41.3.18, 150.172.238.178` };
    for (let i = 0; i < 6; i += 1) await authorizeAdmin('wrong', chain);
    expect(await authorizeAdmin('wrong', FROM(client))).toBe('rate-limited');
  });

  it('does not wave through a request with no address', async () => {
    // Being unidentifiable is not a reason to get unlimited guesses.
    const headers = {};
    for (let i = 0; i < 5; i += 1) await authorizeAdmin('wrong', headers);
    expect(await authorizeAdmin('wrong', headers)).toBe('rate-limited');
  });
});

describe('the reset on success', () => {
  it('clears the count, so normal use never reaches the ceiling', async () => {
    // The screen re-sends the password on every tab switch and every refresh.
    // Ten correct requests in a row is an ordinary amount of looking at a
    // page that reports live state.
    const ip = freshAddress();
    for (let i = 0; i < 10; i += 1) {
      expect(await authorizeAdmin(SECRET, FROM(ip)), `request ${i + 1}`).toBe('ok');
    }
  });

  it('forgives a few typos once the right password arrives', async () => {
    const ip = freshAddress();
    await authorizeAdmin('typo', FROM(ip));
    await authorizeAdmin('typo', FROM(ip));
    expect(await authorizeAdmin(SECRET, FROM(ip))).toBe('ok');

    // The two earlier failures must not still be on the clock.
    for (let i = 0; i < 5; i += 1) {
      expect(await authorizeAdmin('wrong', FROM(ip)), `guess ${i + 1}`).toBe('wrong-secret');
    }
  });
});

describe('when the counter is unavailable', () => {
  it('still requires the password, and does not lock the operator out', async () => {
    // KV being down must not deny access to the screen that would report
    // KV being down — but it must not become a way around the password.
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const kv = await import('../src/server/kv');
    vi.spyOn(kv, 'kvIncr').mockRejectedValue(new Error('KV unreachable'));

    expect(await authorizeAdmin(SECRET, FROM(freshAddress()))).toBe('ok');
    expect(await authorizeAdmin('wrong', FROM(freshAddress()))).toBe('wrong-secret');
  });
});

describe('the status codes', () => {
  it('separates "too many" from "wrong", and hides misconfiguration', async () => {
    expect(adminAuthStatus('rate-limited')).toBe(429);
    expect(adminAuthStatus('wrong-secret')).toBe(401);
    // 401 rather than 500: the caller is unauthorized either way, and that
    // the deployment is misconfigured is the operator's business, not a
    // stranger's. It goes to the server log instead.
    expect(adminAuthStatus('not-configured')).toBe(401);
  });
});
