import { NextResponse } from 'next/server';
import { linksForRecovery } from '@/lib/alumni';
import { sendLinksEmail } from '@/lib/mail';
import { EMAIL_RE, clean } from '@/lib/validate';

export const dynamic = 'force-dynamic';

// Always answers the same way, so nobody can find out which emails are registered.
export async function POST(req: Request) {
  let email = '';
  try { email = clean((await req.json()).email, 120).toLowerCase(); } catch { /* fall through */ }
  if (!EMAIL_RE.test(email)) return NextResponse.json({ ok: false, code: 'email' }, { status: 400 });
  try {
    const items = await linksForRecovery(email);
    if (items.length) await sendLinksEmail(email, items);
  } catch (e) {
    console.error('[recover]', e);
  }
  return NextResponse.json({ ok: true });
}
