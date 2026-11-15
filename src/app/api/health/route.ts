import { NextResponse } from 'next/server';
import { ping } from '@/lib/alumni';

export const dynamic = 'force-dynamic';

// Called daily by Vercel Cron (see vercel.json) so the free Supabase project never pauses.
export async function GET() {
  const ok = await ping().catch(() => false);
  return NextResponse.json({ ok }, { status: ok ? 200 : 503 });
}
