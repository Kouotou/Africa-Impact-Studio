// src/lib/session.ts
import crypto from 'crypto';

export const SESSION_COOKIE = 'ais_admin_session';
export const SESSION_TTL_MS = 8 * 60 * 60 * 1000; // 8 hours

interface SessionPayload {
  uid: string;
  role: string;
  exp: number;
}

// Falls back to a random secret if ADMIN_SESSION_SECRET isn't set, so local
// dev keeps working — but every server restart then invalidates sessions.
const SECRET =
  process.env.ADMIN_SESSION_SECRET ||
  (() => {
    console.warn(
      'ADMIN_SESSION_SECRET is not set. Using a random in-memory secret — admin sessions will not survive a server restart. Set ADMIN_SESSION_SECRET in .env.local.'
    );
    return crypto.randomBytes(32).toString('hex');
  })();

function sign(payloadB64: string): string {
  return crypto.createHmac('sha256', SECRET).update(payloadB64).digest('base64url');
}

export function createSessionToken(uid: string, role: string): string {
  const payload: SessionPayload = { uid, role, exp: Date.now() + SESSION_TTL_MS };
  const payloadB64 = Buffer.from(JSON.stringify(payload)).toString('base64url');
  return `${payloadB64}.${sign(payloadB64)}`;
}

export function verifySessionToken(token: string | undefined | null): SessionPayload | null {
  if (!token) return null;
  const [payloadB64, signature] = token.split('.');
  if (!payloadB64 || !signature) return null;

  const expected = sign(payloadB64);
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;

  try {
    const payload: SessionPayload = JSON.parse(Buffer.from(payloadB64, 'base64url').toString());
    if (typeof payload.exp !== 'number' || payload.exp < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}
