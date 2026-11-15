import { NextResponse } from 'next/server';
import { ping } from '@/lib/alumni';

export const dynamic = 'force-dynamic';

// Called daily by Vercel Cron (see vercel.json) so the free Supabase project never pauses.
// Returns only a safe code (e.g. PGRST205, 42501, env-missing) — never keys, URLs or messages.
export async function GET() {
  const result = await ping();
  return NextResponse.json(result, { status: result.ok ? 200 : 503 });
}
