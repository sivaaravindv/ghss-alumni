'use client';

import { useMemo, useState } from 'react';
import { toCsv } from '@/lib/csv';
import { logout } from '@/app/admin/actions';

export type AdminRow = {
  id: number; created_at: string; name: string; father_name: string; door_no: string | null; street: string | null;
  village: string; passed_out_year: number; phone: string; email: string | null; worked_as: string | null;
  currently_doing: string; form_language: string; show_contact: boolean; source: string;
  private_link: string; send_link_on_whatsapp: string;
};

/** "Other: Farming" → "Other" so free-text answers group together in the filter. */
const doingGroup = (s: string) => (s.startsWith('Other:') ? 'Other' : s);
const norm = (s: string) => s.trim().toLowerCase();
const fmtDate = (iso: string) =>
  new Date(iso).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Kolkata' });

function download(rows: AdminRow[], name: string) {
  const url = URL.createObjectURL(new Blob([toCsv(rows)], { type: 'text/csv;charset=utf-8' }));
  const a = Object.assign(document.createElement('a'), { href: url, download: name });
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/** Distinct values with counts, most common first. */
function options(rows: AdminRow[], pick: (r: AdminRow) => string) {
  const m = new Map<string, { label: string; n: number }>();
  for (const r of rows) {
    const v = pick(r); if (!v) continue;
    const k = norm(v); const e = m.get(k);
    if (e) e.n++; else m.set(k, { label: v, n: 1 });
  }
  return [...m.entries()].sort((a, b) => b[1].n - a[1].n || a[1].label.localeCompare(b[1].label));
}

export function AdminView({ rows }: { rows: AdminRow[] }) {
  const [q, setQ] = useState('');
  const [year, setYear] = useState('');
  const [village, setVillage] = useState('');
  const [doing, setDoing] = useState('');
  const [contact, setContact] = useState('');
  const [source, setSource] = useState('');
  const [sort, setSort] = useState<'new' | 'old' | 'name' | 'year'>('new');

  const years = useMemo(() => [...new Set(rows.map(r => r.passed_out_year))].sort((a, b) => b - a), [rows]);
  const villages = useMemo(() => options(rows, r => r.village), [rows]);
  const doings = useMemo(() => options(rows, r => doingGroup(r.currently_doing)), [rows]);
  const sources = useMemo(() => options(rows, r => r.source), [rows]);

  const shown = useMemo(() => {
    const words = norm(q).split(/\s+/).filter(Boolean);
    const out = rows.filter(r => {
      if (year && String(r.passed_out_year) !== year) return false;
      if (village && norm(r.village) !== village) return false;
      if (doing && norm(doingGroup(r.currently_doing)) !== doing) return false;
      if (contact && String(r.show_contact) !== contact) return false;
      if (source && norm(r.source) !== source) return false;
      if (words.length) {
        const hay = norm([r.name, r.father_name, r.village, r.street, r.phone, r.phone.replace(/\D/g, ''), r.email, r.worked_as, r.currently_doing].join(' '));
        if (!words.every(w => hay.includes(w))) return false;
      }
      return true;
    });
    const by: Record<typeof sort, (a: AdminRow, b: AdminRow) => number> = {
      new: (a, b) => b.created_at.localeCompare(a.created_at),
      old: (a, b) => a.created_at.localeCompare(b.created_at),
      name: (a, b) => a.name.localeCompare(b.name),
      year: (a, b) => b.passed_out_year - a.passed_out_year || a.name.localeCompare(b.name)
    };
    return out.sort(by[sort]);
  }, [rows, q, year, village, doing, contact, source, sort]);

  const filtered = !!(q || year || village || doing || contact || source);
  const reset = () => { setQ(''); setYear(''); setVillage(''); setDoing(''); setContact(''); setSource(''); };
  const today = new Date().toISOString().slice(0, 10);

  return (
    <div className="admin">
      <div className="admin-top">
        <div>
          <h1>Alumni admin</h1>
          <p className="sub">{rows.length} registered · {years.length} batches · {villages.length} villages</p>
        </div>
        <form action={logout}><button className="btn secondary small" type="submit">Sign out</button></form>
      </div>

      <div className="card admin-filters">
        <input type="search" placeholder="Search name, father, phone, email, village…" value={q} onChange={e => setQ(e.target.value)} aria-label="Search" />
        <div className="admin-grid">
          <select value={year} onChange={e => setYear(e.target.value)} aria-label="Year">
            <option value="">All years</option>
            {years.map(y => <option key={y} value={y}>{y} ({rows.filter(r => r.passed_out_year === y).length})</option>)}
          </select>
          <select value={village} onChange={e => setVillage(e.target.value)} aria-label="Village">
            <option value="">All villages</option>
            {villages.map(([k, v]) => <option key={k} value={k}>{v.label} ({v.n})</option>)}
          </select>
          <select value={doing} onChange={e => setDoing(e.target.value)} aria-label="Currently doing">
            <option value="">Any occupation</option>
            {doings.map(([k, v]) => <option key={k} value={k}>{v.label} ({v.n})</option>)}
          </select>
          <select value={contact} onChange={e => setContact(e.target.value)} aria-label="Contact visibility">
            <option value="">Contact: any</option>
            <option value="true">Contact shown</option>
            <option value="false">Contact hidden</option>
          </select>
          <select value={source} onChange={e => setSource(e.target.value)} aria-label="Source">
            <option value="">Any source</option>
            {sources.map(([k, v]) => <option key={k} value={k}>{v.label === 'web' ? 'Website' : v.label === 'google-sheet' ? 'Old Google Sheet' : v.label} ({v.n})</option>)}
          </select>
          <select value={sort} onChange={e => setSort(e.target.value as typeof sort)} aria-label="Sort">
            <option value="new">Newest first</option>
            <option value="old">Oldest first</option>
            <option value="name">Name A–Z</option>
            <option value="year">Year (latest batch first)</option>
          </select>
        </div>
        <div className="admin-actions">
          <span className="sub"><b>{shown.length}</b> of {rows.length} shown{filtered && <> · <button className="linkbtn" onClick={reset}>Clear filters</button></>}</span>
          <div className="btn-row">
            <button className="btn small" onClick={() => download(shown, `ghss-alumni-${filtered ? 'filtered-' : ''}${today}.csv`)} disabled={!shown.length}>
              Download {filtered ? 'filtered ' : ''}CSV ({shown.length})
            </button>
            {filtered && <button className="btn secondary small" onClick={() => download(rows, `ghss-alumni-${today}.csv`)}>All ({rows.length})</button>}
          </div>
        </div>
      </div>

      <div className="card admin-table-card">
        {shown.length === 0 ? <p className="sub" style={{ margin: 0 }}>No entries match these filters.</p> : (
          <div className="admin-scroll">
            <table className="admin-table">
              <thead>
                <tr><th>#</th><th>Name</th><th>Year</th><th>Village</th><th>Phone</th><th>Email</th><th>Currently doing</th><th>Worked as</th><th>Address</th><th>Contact</th><th>Registered</th><th>Links</th></tr>
              </thead>
              <tbody>
                {shown.map((r, i) => (
                  <tr key={r.id}>
                    <td className="num">{i + 1}</td>
                    <td><b>{r.name}</b><div className="muted">s/o {r.father_name}</div></td>
                    <td className="num">{r.passed_out_year}</td>
                    <td>{r.village}</td>
                    <td className="nowrap"><a href={`tel:${r.phone.replace(/\s/g, '')}`}>{r.phone}</a></td>
                    <td>{r.email ? <a href={`mailto:${r.email}`}>{r.email}</a> : <span className="muted">–</span>}</td>
                    <td>{r.currently_doing}</td>
                    <td>{r.worked_as || <span className="muted">–</span>}</td>
                    <td>{[r.door_no, r.street].filter(Boolean).join(', ') || <span className="muted">–</span>}</td>
                    <td>{r.show_contact ? <span className="tag ok">Shown</span> : <span className="tag">Hidden</span>}</td>
                    <td className="nowrap">{fmtDate(r.created_at)}<div className="muted">{r.source === 'web' ? 'Website' : 'Old Sheet'}</div></td>
                    <td className="nowrap">
                      <a href={r.private_link} target="_blank" rel="noreferrer">Batch page</a>
                      {r.send_link_on_whatsapp && <> · <a href={r.send_link_on_whatsapp} target="_blank" rel="noreferrer">WhatsApp</a></>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
