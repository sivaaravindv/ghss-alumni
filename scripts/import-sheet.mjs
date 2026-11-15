#!/usr/bin/env node
/**
 * Imports the existing Google Sheet into Supabase.
 *
 *   1. In the Sheet: 🎓 Alumni → "Create private links for everyone" (fixes #ERROR! phones, adds tokens)
 *   2. Open the "Responses" tab → File → Download → Comma-separated values (.csv)
 *   3. SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... node scripts/import-sheet.mjs Responses.csv
 *
 * Existing private tokens are kept, so links already sent keep working.
 * Safe to run again: people already imported are skipped.
 */
import { readFileSync } from 'node:fs';
import { createClient } from '@supabase/supabase-js';

const file = process.argv[2];
if (!file) { console.error('Usage: node scripts/import-sheet.mjs <Responses.csv>'); process.exit(1); }
const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = process.env;
if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) { console.error('Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY'); process.exit(1); }
const db = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });

/** Minimal RFC 4180 CSV parser (quotes, commas and newlines inside quotes). */
function parseCsv(text) {
  const rows = []; let row = [], cell = '', q = false;
  text = text.replace(/^﻿/, '');
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) {
      if (c === '"' && text[i + 1] === '"') { cell += '"'; i++; }
      else if (c === '"') q = false;
      else cell += c;
    } else if (c === '"') q = true;
    else if (c === ',') { row.push(cell); cell = ''; }
    else if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i++;
      row.push(cell); rows.push(row); row = []; cell = '';
    } else cell += c;
  }
  if (cell !== '' || row.length) { row.push(cell); rows.push(row); }
  return rows.filter(r => r.some(x => x.trim() !== ''));
}

const clean = (v, max = 100) => String(v ?? '').replace(/\s+/g, ' ').trim().slice(0, max);

function normPhone(p) {
  p = clean(p, 25).replace(/^'/, '');
  if (/^\d{10}$/.test(p)) return '+91 ' + p;
  if (/^91\d{10}$/.test(p)) return '+91 ' + p.slice(2);
  const m = p.match(/^\+(\d{1,4})\s*(\d{6,14})$/);
  return m ? `+${m[1]} ${m[2]}` : null;
}

function parseDate(s) {
  s = clean(s, 40);
  if (!s) return undefined;
  // Sheets in India export "dd/mm/yyyy hh:mm:ss" (IST)
  const m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})(?:\s+(\d{1,2}):(\d{2})(?::(\d{2}))?)?/);
  if (m) return new Date(Date.UTC(+m[3], +m[2] - 1, +m[1], +(m[4] || 0) - 5, +(m[5] || 0) - 30, +(m[6] || 0))).toISOString();
  const d = new Date(s);
  return isNaN(d) ? undefined : d.toISOString();
}

const rows = parseCsv(readFileSync(file, 'utf8'));
const head = rows.shift().map(h => h.trim());
const col = name => head.indexOf(name);
for (const need of ['Student Name', 'Father Name', 'Village', 'Passed Out Year', 'Contact Number', 'Currently Doing']) {
  if (col(need) === -1) { console.error(`Column "${need}" not found. Columns: ${head.join(', ')}`); process.exit(1); }
}
const get = (r, name, max) => (col(name) === -1 ? '' : clean(r[col(name)], max));

let added = 0, skipped = 0, failed = 0;
for (const [i, r] of rows.entries()) {
  const line = i + 2;
  const name = get(r, 'Student Name');
  const phone = normPhone(get(r, 'Contact Number', 25));
  const year = Number(get(r, 'Passed Out Year', 10));
  if (!name) { console.warn(`row ${line}: no name – skipped`); failed++; continue; }
  if (!phone) { console.warn(`row ${line} (${name}): phone "${get(r, 'Contact Number', 25)}" not usable – skipped. Fix it in the sheet and run again.`); failed++; continue; }
  if (!(year >= 1950 && year <= new Date().getFullYear())) { console.warn(`row ${line} (${name}): year "${year}" not valid – skipped`); failed++; continue; }

  const email = get(r, 'Email', 120).toLowerCase();
  const token = get(r, 'Token', 40).replace(/^'/, '').toLowerCase();
  const rec = {
    name,
    father_name: get(r, 'Father Name') || '-',
    door_no: get(r, 'Door No', 20).replace(/^'/, '') || null,
    street: get(r, 'Street') || null,
    village: get(r, 'Village') || '-',
    passed_out_year: year,
    phone,
    email: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) ? email : null,
    worked_as: get(r, 'Worked As') || null,
    currently_doing: get(r, 'Currently Doing', 150) || 'Other',
    form_language: get(r, 'Form Language') === 'English' ? 'English' : 'Tamil',
    show_contact: /^yes$/i.test(get(r, 'Show Contact', 5)),
    source: 'google-sheet'
  };
  const created = parseDate(get(r, 'Timestamp', 40));
  if (created) rec.created_at = created;
  if (/^[a-f0-9]{32}$/.test(token)) rec.token = token;

  const { error } = await db.from('alumni').insert(rec);
  if (!error) { added++; continue; }
  if (error.code === '23505') { skipped++; continue; }            // already imported
  console.warn(`row ${line} (${name}): ${error.message}`); failed++;
}
console.log(`\nDone. Added ${added}, already there ${skipped}, problems ${failed}.`);
