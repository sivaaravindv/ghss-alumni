import 'server-only';
import { createHmac, timingSafeEqual } from 'node:crypto';
import { cookies } from 'next/headers';

export const ADMIN_COOKIE = 'ghss_admin';
export const ADMIN_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

function adminKey(): string {
  const k = process.env.ADMIN_KEY || '';
  return k.length >= 16 ? k : '';
}

function same(a: string, b: string): boolean {
  const x = Buffer.from(a), y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

/** True if the given string is the admin key. */
export function keyOk(given: string | null | undefined): boolean {
  const want = adminKey();
  return !!want && !!given && same(given, want);
}

/** Cookie value: an HMAC derived from the key, so the key itself never sits in the browser.
 *  Changing ADMIN_KEY in Vercel signs everyone out. */
export function sessionValue(): string {
  const want = adminKey();
  return want ? createHmac('sha256', want).update('ghss-admin-session-v1').digest('hex') : '';
}

export async function isAdmin(): Promise<boolean> {
  const want = sessionValue();
  const got = (await cookies()).get(ADMIN_COOKIE)?.value;
  return !!want && !!got && same(got, want);
}
