import { NextResponse } from 'next/server';
import { register } from '@/lib/alumni';
import { checkRegistration, type RegisterInput } from '@/lib/validate';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try { body = await req.json(); } catch { return NextResponse.json({ ok: false, code: 'bad' }, { status: 400 }); }

  // Honeypot: real people never see or fill the "website" field
  if (body.website) {
    console.warn('[register] honeypot filled – rejected', { len: String(body.website).length });
    return NextResponse.json({ ok: false, code: 'bad' }, { status: 400 });
  }

  const checked = checkRegistration(body as Partial<RegisterInput>);
  if (!checked.ok) return NextResponse.json(checked, { status: 400 });

  try {
    const res = await register(checked.rec);
    return NextResponse.json(res, { status: res.ok ? 200 : 409 });
  } catch (e) {
    console.error('[register]', e);
    return NextResponse.json({ ok: false, code: 'server' }, { status: 500 });
  }
}
