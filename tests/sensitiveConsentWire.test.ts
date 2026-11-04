/** The client and the server have to agree about what a consent looks like.
 *
 * They did not. The browser posts the Art. 9 consent as
 * `{kind:'sensitive', version, granted, decidedAt}`; the endpoint only knew
 * the privacy-policy shape, `{version, acceptedAt}`, and rejected anything
 * without an `acceptedAt` as a bad record. So every grant was answered 400,
 * `saveSensitiveConsent` — written, exported, and called from nowhere — never
 * ran, and `hasSensitiveConsent` on the server was false for everyone.
 *
 * entitlement.ts refuses to analyse a letter or draft a reply without that
 * record. Both features were therefore refused for every account, paying
 * included, and the gate reported a server rejection as "check your
 * connection", which sent people to their wifi instead of to us.
 *
 * Nothing caught it because the two halves are in different module scopes
 * (the browser tree is ESM, api/ is CommonJS) and nothing exercised the
 * payload end to end. Tests are the one place that can import both, so the
 * contract is pinned here: what the client sends, and what the handler does
 * with it.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';

const saved: { userId: string; record: Record<string, unknown> }[] = [];
const policySaved: { userId: string; record: Record<string, unknown> }[] = [];

vi.mock('../src/server/consent.js', () => ({
  saveSensitiveConsent: async (userId: string, record: Record<string, unknown>) => {
    saved.push({ userId, record });
  },
  saveConsentRecord: async (userId: string, record: Record<string, unknown>) => {
    policySaved.push({ userId, record });
  },
}));
vi.mock('../src/server/auth.js', () => ({
  getUserFromRequest: async () => ({ id: 'user-1', email: 'parent@example.com' }),
}));
vi.mock('../src/server/backup.js', () => ({ saveCloudBackup: async () => {}, loadCloudBackup: async () => null }));
vi.mock('../src/server/eraseAccount.js', () => ({ eraseAccountData: async () => ({ ok: true, deleted: [], accountDeleted: true }) }));

const { default: handler } = await import('../api/backup.js');

function call(body: unknown) {
  const res = {
    statusCode: 0,
    payload: undefined as unknown,
    status(code: number) {
      this.statusCode = code;
      return this;
    },
    json(value: unknown) {
      this.payload = value;
    },
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return handler({ method: 'POST', query: { action: 'consent' }, body } as any, res as any).then(() => res);
}

/** Exactly what src/lib/consent.ts posts in grantSensitiveConsent(). */
const CLIENT_PAYLOAD = {
  kind: 'sensitive',
  version: 1,
  granted: true,
  decidedAt: '2026-11-04T14:06:00.000Z',
};

beforeEach(() => {
  saved.length = 0;
  policySaved.length = 0;
});

describe('the payload the app actually sends', () => {
  it('is accepted', async () => {
    // The bug, in one line: this used to be 400.
    const res = await call(CLIENT_PAYLOAD);
    expect(res.statusCode).toBe(200);
  });

  it('is written to the sensitive record, not the policy one', async () => {
    await call(CLIENT_PAYLOAD);
    expect(saved).toHaveLength(1);
    expect(policySaved).toHaveLength(0);
    expect(saved[0].userId).toBe('user-1');
    expect(saved[0].record).toMatchObject({ version: 1, granted: true, decidedAt: CLIENT_PAYLOAD.decidedAt });
  });

  it('records who it was for, and when we stored it', async () => {
    // Art. 7(1) puts the burden of proving consent on us, so a record that
    // cannot say whose it is or when it arrived is not proof of anything.
    await call(CLIENT_PAYLOAD);
    expect(saved[0].record.email).toBe('parent@example.com');
    expect(Date.parse(String(saved[0].record.recordedAt))).not.toBeNaN();
  });
});

describe('a withdrawal travels the same way', () => {
  it('is stored as granted: false rather than dropped', async () => {
    const res = await call({ ...CLIENT_PAYLOAD, granted: false });
    expect(res.statusCode).toBe(200);
    expect(saved[0].record.granted).toBe(false);
  });
});

describe('the privacy-policy consent still works', () => {
  it('goes to its own record', async () => {
    const res = await call({ version: 6, acceptedAt: '2026-11-04T14:06:00.000Z' });
    expect(res.statusCode).toBe(200);
    expect(policySaved).toHaveLength(1);
    expect(saved).toHaveLength(0);
  });
});

describe('a malformed sensitive consent is still refused', () => {
  it('rejects a missing decidedAt', async () => {
    const res = await call({ kind: 'sensitive', version: 1, granted: true });
    expect(res.statusCode).toBe(400);
    expect(saved).toHaveLength(0);
  });

  it('rejects a granted that is not a boolean', async () => {
    // 'false' would otherwise store as a grant, which is the wrong way round
    // for Art. 9 data.
    const res = await call({ ...CLIENT_PAYLOAD, granted: 'false' });
    expect(res.statusCode).toBe(400);
    expect(saved).toHaveLength(0);
  });

  it('rejects an unparseable date', async () => {
    const res = await call({ ...CLIENT_PAYLOAD, decidedAt: 'yesterday' });
    expect(res.statusCode).toBe(400);
    expect(saved).toHaveLength(0);
  });
});
