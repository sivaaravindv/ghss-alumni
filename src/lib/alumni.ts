import 'server-only';
import { createHash } from 'node:crypto';
import { db } from './supabase';
import { privateLink, shareUrl, waSendLink } from './links';
import { TOKEN_RE, type CleanRecord } from './validate';

export type Member = { n: string; v: string; d: string; w: string; p: string; self: boolean };
export type BatchData = {
  me: { name: string; year: number; showContact: boolean; phone: string; link: string };
  groups: Record<number, Member[]>;
  total: number;
  batches: [number, number][];
  shareUrl: string;
};

/** Escape % and _ so a village name is matched literally by ILIKE. */
const likeLiteral = (s: string) => s.replace(/[\\%_]/g, m => '\\' + m);

export async function listVillages(): Promise<string[]> {
  const { data, error } = await db().rpc('village_names');
  if (error) throw error;
  return (data as { village: string }[]).map(r => r.village);
}

export async function register(rec: CleanRecord):
  Promise<{ ok: true; token: string } | { ok: false; code: 'duplicate' }> {
  // Reuse the existing spelling of a village (e.g. "vellalankulam" -> "Vellalankulam")
  const { data: v } = await db().from('alumni').select('village')
    .ilike('village', likeLiteral(rec.village)).order('id').limit(1);
  if (v && v[0]) rec = { ...rec, village: v[0].village };

  const { data, error } = await db().from('alumni').insert(rec).select('token').single();
  if (error) {
    if (error.code === '23505') return { ok: false, code: 'duplicate' };
    throw error;
  }
  return { ok: true, token: data.token };
}

export async function getBatch(token: string): Promise<BatchData | null> {
  if (!TOKEN_RE.test(token)) return null;
  const { data: me, error } = await db().from('alumni')
    .select('id, name, passed_out_year, show_contact, phone').eq('token', token).maybeSingle();
  if (error) throw error;
  if (!me) return null;

  const y = me.passed_out_year as number;
  const [{ data: rows, error: e1 }, { data: counts, error: e2 }] = await Promise.all([
    db().from('alumni')
      .select('id, name, village, currently_doing, worked_as, phone, show_contact, passed_out_year')
      .gte('passed_out_year', y - 1).lte('passed_out_year', y + 1).order('name').limit(5000),
    db().rpc('batch_counts')
  ]);
  if (e1) throw e1;
  if (e2) throw e2;

  const groups: Record<number, Member[]> = { [y - 1]: [], [y]: [], [y + 1]: [] };
  for (const r of rows ?? []) {
    const self = r.id === me.id;
    groups[r.passed_out_year].push({
      n: r.name, v: r.village, d: r.currently_doing, w: r.worked_as ?? '',
      p: self || r.show_contact ? r.phone : '',   // phone only with permission
      self
    });
  }
  for (const k of Object.keys(groups)) groups[+k].sort((a, b) => Number(b.self) - Number(a.self));

  const batches = (counts as { passed_out_year: number; n: number }[]).map(c => [c.passed_out_year, Number(c.n)] as [number, number]);
  return {
    me: { name: me.name, year: y, showContact: me.show_contact, phone: me.phone, link: privateLink(token) },
    groups,
    total: batches.reduce((s, b) => s + b[1], 0),
    batches,
    shareUrl: shareUrl()
  };
}

export async function setShowContact(token: string, show: boolean): Promise<boolean> {
  if (!TOKEN_RE.test(token)) return false;
  const { data, error } = await db().from('alumni').update({ show_contact: show }).eq('token', token).select('id');
  if (error) throw error;
  return !!data && data.length > 0;
}

/** Private links registered with this email, at most once per 10 minutes per address. */
export async function linksForRecovery(email: string): Promise<{ name: string; year: number; link: string }[]> {
  const hash = createHash('sha256').update(email).digest('hex');
  const since = new Date(Date.now() - 10 * 60 * 1000).toISOString();
  const { data: recent } = await db().from('recovery_log').select('id').eq('email_hash', hash).gte('created_at', since).limit(1);
  if (recent && recent.length) return [];
  await db().from('recovery_log').insert({ email_hash: hash });

  const { data, error } = await db().from('alumni').select('name, passed_out_year, token').eq('email', email);
  if (error) throw error;
  return (data ?? []).map(r => ({ name: r.name, year: r.passed_out_year, link: privateLink(r.token) }));
}

/** Everything, for the committee's CSV / Google Sheet. */
export async function exportAll(): Promise<Record<string, unknown>[]> {
  const out: Record<string, unknown>[] = [];
  for (let from = 0; ; from += 1000) {
    const { data, error } = await db().from('alumni').select('*').order('id').range(from, from + 999);
    if (error) throw error;
    out.push(...(data ?? []));
    if (!data || data.length < 1000) break;
  }
  return out.map(r => ({
    ...r,
    private_link: privateLink(String(r.token)),
    send_link_on_whatsapp: waSendLink(String(r.name), String(r.phone), String(r.token))
  }));
}

export type PingResult = { ok: true } | { ok: false; code?: string; reason?: 'env-missing' | 'exception' };

/** Health check. Logs the full error server-side; returns only a safe code for the browser. */
export async function ping(): Promise<PingResult> {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('[health] SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is not set');
    return { ok: false, reason: 'env-missing' };
  }
  try {
    const { error } = await db().from('alumni').select('id').limit(1);
    if (error) {
      console.error('[health]', error);
      return { ok: false, code: error.code || 'unknown' };
    }
    return { ok: true };
  } catch (e) {
    console.error('[health]', e);
    return { ok: false, reason: 'exception' };
  }
}
