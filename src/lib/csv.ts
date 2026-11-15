// CSV formatting shared by the admin export route (server) and the admin page (browser download).

export const CSV_COLUMNS: [string, string][] = [
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

/** CSV text with a UTF-8 BOM so Excel shows Tamil correctly. */
export function toCsv(rows: Record<string, unknown>[]): string {
  const lines = [CSV_COLUMNS.map(c => c[1]).join(','), ...rows.map(r => CSV_COLUMNS.map(c => cell(r[c[0]])).join(','))];
  return '﻿' + lines.join('\r\n');
}
