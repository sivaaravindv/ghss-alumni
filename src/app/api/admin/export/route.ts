import { exportAll } from '@/lib/alumni';
import { isAdmin, keyOk } from '@/lib/admin';
import { toCsv } from '@/lib/csv';

export const dynamic = 'force-dynamic';

/**
 * CSV of everyone, for the committee. Works when signed in at /admin, or with the key:
 *   =IMPORTDATA("https://YOUR-SITE/api/admin/export?key=YOUR_ADMIN_KEY")
 */
export async function GET(req: Request) {
  const ok = keyOk(new URL(req.url).searchParams.get('key')) || (await isAdmin());
  if (!ok) return new Response('Not found', { status: 404 });
  const rows = await exportAll();
  return new Response(toCsv(rows), {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="ghss-alumni.csv"',
      'Cache-Control': 'no-store'
    }
  });
}
