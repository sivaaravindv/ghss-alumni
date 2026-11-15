import { timingSafeEqual } from 'node:crypto';
import { exportAll } from '@/lib/alumni';

export const dynamic = 'force-dynamic';

const COLUMNS: [string, string][] = [
  ['created_at', 'Timestamp'], ['name', 'Student Name'], ['father_name', 'Father Name'], ['door_no', 'Door No'],
  ['street', 'Street'], ['village', 'Village'], ['passed_out_year', 'Passed Out Year'], ['phone', 'Contact Number'],
  ['email', 'Email'], ['worked_as', 'Worked As'], ['currently_doing', 'Currently Doing'], ['form_language', 'Form Language'],
  ['show_contact', 'Show Contact'], ['private_link', 'Private Link'], ['send_link_on_whatsapp', 'Send Link on WhatsApp']
];

function cell(v: unknown): string {
  let s = v == null ? '' : typeof v === 'boolean' ? (v ? 'Yes' : 'No') : String(v);
  // Stop spreadsheets treating free text as a formula (validated phone numbers like "+91 98…" are safe)
  if (/^[=+\-@]/.test(s) && !/^\+\d{1,4} \d{6,14}$/.test(s)) s = "'" + s;
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

function keyOk(given: string | null): boolean {
  const want = process.env.ADMIN_KEY || '';
  if (!given || want.length < 16) return false;
  const a = Buffer.from(given), b = Buffer.from(want);
  return a.length === b.length && timingSafeEqual(a, b);
}

/**
 * CSV of everyone, for the committee. Use it in Google Sheets with:
 *   =IMPORTDATA("https://YOUR-SITE/api/admin/export?key=YOUR_ADMIN_KEY")
 */
export async function GET(req: Request) {
  if (!keyOk(new URL(req.url).searchParams.get('key'))) return new Response('Not found', { status: 404 });
  const rows = await exportAll();
  const csv = [COLUMNS.map(c => c[1]).join(','), ...rows.map(r => COLUMNS.map(c => cell(r[c[0]])).join(','))].join('\r\n');
  return new Response('﻿' + csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="ghss-alumni.csv"',
      'Cache-Control': 'no-store'
    }
  });
}
