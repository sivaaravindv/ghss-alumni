import { NextResponse } from 'next/server';
import { setShowContact } from '@/lib/alumni';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { token, show } = await req.json();
    const ok = await setShowContact(String(token ?? '').toLowerCase(), show === true);
    return NextResponse.json({ ok }, { status: ok ? 200 : 404 });
  } catch (e) {
    console.error('[visibility]', e);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
