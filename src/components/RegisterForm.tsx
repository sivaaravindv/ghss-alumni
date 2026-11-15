'use client';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CODES, CURRENT, type Key } from '@/lib/i18n';
import { EMAIL_RE, MIN_YEAR, phoneValid } from '@/lib/validate';
import { Header } from './Header';
import { useLang } from './LangProvider';

type Fields = {
  name: string; father: string; door: string; street: string; village: string; year: string;
  cc: string; ccOther: string; phone: string; email: string; worked: string; current: string; currentOther: string;
  showContact: boolean; website: string;
};
const EMPTY: Fields = {
  name: '', father: '', door: '', street: '', village: '', year: '', cc: '+91', ccOther: '', phone: '',
  email: '', worked: '', current: '', currentOther: '', showContact: false, website: ''
};
type F = keyof Fields;

export function storedToken(): string { try { return localStorage.getItem('alumniToken') || ''; } catch { return ''; } }

export function RegisterForm({ villages, badLink }: { villages: string[]; badLink?: boolean }) {
  const { lang, t } = useLang();
  const router = useRouter();
  const [f, setF] = useState<Fields>(EMPTY);
  const [bad, setBad] = useState<Set<F>>(new Set());
  const [alert, setAlert] = useState('');
  const [busy, setBusy] = useState(false);
  const [returning, setReturning] = useState('');

  useEffect(() => { setReturning(storedToken()); }, []);

  const set = <K extends F>(k: K, v: Fields[K]) => {
    setF(p => ({ ...p, [k]: v }));
    if (bad.has(k)) setBad(b => { const n = new Set(b); n.delete(k); return n; });
  };

  const cc = f.cc === 'other' ? (f.ccOther.replace(/\D/g, '').slice(0, 4) ? '+' + f.ccOther.replace(/\D/g, '').slice(0, 4) : '') : f.cc;
  const years = useMemo(() => { const out: number[] = []; for (let y = new Date().getFullYear(); y >= MIN_YEAR; y--) out.push(y); return out; }, []);

  function validate(): Set<F> {
    const b = new Set<F>();
    (['name', 'father', 'door', 'street', 'village', 'year'] as F[]).forEach(k => { if (!String(f[k]).trim()) b.add(k); });
    if (!phoneValid(cc, f.phone)) b.add('phone');
    if (f.email.trim() && !EMAIL_RE.test(f.email.trim())) b.add('email');
    if (!f.current || (f.current === 'Other' && !f.currentOther.trim())) b.add('current');
    return b;
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setAlert('');
    const b = validate();
    setBad(b);
    if (b.size) { setTimeout(() => document.querySelector<HTMLElement>('.invalid input, .invalid select')?.focus(), 0); return; }
    setBusy(true);
    try {
      const res = await fetch('/api/register', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: f.name, father: f.father, door: f.door, street: f.street, village: f.village, year: Number(f.year),
          cc, phone: f.phone, email: f.email, worked: f.worked,
          current: f.current === 'Other' ? 'Other: ' + f.currentOther.trim() : f.current,
          showContact: f.showContact, lang, website: f.website
        })
      });
      const r = await res.json().catch(() => ({}));
      if (r.ok && r.token) {
        try { localStorage.setItem('alumniToken', r.token); } catch {}
        router.push(`/b/${r.token}?new=1`);
        return;
      }
      const map: Record<string, Key> = { duplicate: 'errDuplicate', phone: cc === '+91' ? 'phoneErr' : 'phoneErrIntl', email: 'emailErr', year: 'errYear', required: 'required' };
      setAlert(t(map[r.code] || 'errGeneric'));
    } catch {
      setAlert(t('errGeneric'));
    }
    setBusy(false);
  }

  const field = (k: F, label: Key, input: React.ReactNode, opts: { req?: boolean; err?: Key; full?: boolean } = {}) => (
    <div className={`field${bad.has(k) ? ' invalid' : ''}${opts.full ? ' full' : ''}`}>
      <label htmlFor={k}>{t(label)} {opts.req ? <span className="req">*</span> : <span className="opt">{t('optional')}</span>}</label>
      {input}
      {opts.err && <div className="err">{t(opts.err)}</div>}
    </div>
  );
  const text = (k: F, extra: React.InputHTMLAttributes<HTMLInputElement> = {}) => (
    <input id={k} value={String(f[k])} onChange={e => set(k, e.target.value as never)} maxLength={100} {...extra} />
  );

  return (
    <>
      <Header titleKey="title" subKey="subtitle" />

      {badLink && <div className="alert" style={{ display: 'block' }}>{t('badLink')}</div>}

      {returning && (
        <div className="returning">
          <p>{t('returningMsg')}</p>
          <button type="button" className="btn small" onClick={() => router.push(`/b/${returning}`)}>{t('viewMyBatch')}</button>
        </div>
      )}

      <div className="banner">
        <div className="ico">🎓</div>
        <div><b>{t('newTitle')}</b><span>{t('newBody')}</span></div>
      </div>

      <section className="intro" lang={lang}>
        <p><strong>{t('introHello')}</strong></p>
        <p dangerouslySetInnerHTML={{ __html: t('introLead') }} />
        <ul>{(['intro1', 'intro2', 'intro3', 'intro4'] as Key[]).map(k => <li key={k}>{t(k)}</li>)}</ul>
        <p className="note">{t('introNote')}</p>
      </section>

      <div className="card">
        {alert && <div className="alert" style={{ display: 'block' }}>{alert}</div>}

        <form id="form" noValidate onSubmit={submit}>
          {/* Honeypot for bots – hidden from people */}
          <div className="hp" aria-hidden="true">
            {/* Neutral name + ignore hints so browser autofill / password managers never fill it
                (Chrome autofilled a field named "website" with the user's company and address). */}
            <input type="text" tabIndex={-1} autoComplete="one-time-code" name="hp_x9" id="hp_x9"
              data-lpignore="true" data-1p-ignore="true" data-bwignore="true" data-form-type="other"
              value={f.website} onChange={e => set('website', e.target.value)} />
          </div>

          {field('name', 'name', text('name', { autoComplete: 'name' }), { req: true, err: 'required' })}
          {field('father', 'father', text('father'), { req: true, err: 'required' })}
          {field('door', 'door', text('door', { maxLength: 20, placeholder: '12/3A' }), { req: true, err: 'required' })}
          {field('street', 'street', text('street'), { req: true, err: 'required' })}
          {field('village', 'village', <VillageInput value={f.village} onChange={v => set('village', v)} villages={villages} />, { req: true, err: 'required' })}
          {field('year', 'year', (
            <select id="year" value={f.year} onChange={e => set('year', e.target.value)}>
              <option value="">{t('select')}</option>
              {years.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          ), { req: true, err: 'required' })}
          {field('phone', 'phone', (
            <>
              <div className="phone-row">
                <select id="cc" aria-label="Country code" value={f.cc} onChange={e => {
                  const v = e.target.value; set('cc', v); if (v === '+91') set('phone', f.phone.slice(0, 10));
                }}>
                  {CODES.map(([code, flag]) => <option key={code} value={code}>{flag} {code}</option>)}
                  <option value="other">🌐 {t('otherCode')}</option>
                </select>
                <input id="phone" type="tel" inputMode="numeric" autoComplete="tel-national"
                  placeholder={f.cc === '+91' ? '9876543210' : '501234567'} value={f.phone}
                  onChange={e => set('phone', e.target.value.replace(/\D/g, '').slice(0, f.cc === '+91' ? 10 : 15))} />
              </div>
              {f.cc === 'other' && <input style={{ marginTop: 8 }} type="tel" inputMode="tel" maxLength={5} placeholder="+"
                value={f.ccOther} onChange={e => set('ccOther', e.target.value)} />}
            </>
          ), { req: true, err: f.cc === '+91' ? 'phoneErr' : 'phoneErrIntl' })}
          {field('email', 'email', text('email', { type: 'email', inputMode: 'email', autoComplete: 'email', autoCapitalize: 'off', spellCheck: false, maxLength: 120, placeholder: 'name@gmail.com' }), { err: 'emailErr' })}
          {field('worked', 'worked', text('worked', { placeholder: t('workedPh') }))}
          {field('current', 'current', (
            <>
              <select id="current" value={f.current} onChange={e => set('current', e.target.value)}>
                <option value="">{t('select')}</option>
                {CURRENT.map(o => <option key={o.v} value={o.v}>{o[lang]}</option>)}
              </select>
              {f.current === 'Other' && <input style={{ marginTop: 8 }} maxLength={100} placeholder={t('otherPh')}
                value={f.currentOther} onChange={e => set('currentOther', e.target.value)} />}
            </>
          ), { req: true, err: 'required' })}

          <div className="field full">
            <label className="check">
              <input type="checkbox" id="showContact" checked={f.showContact} onChange={e => set('showContact', e.target.checked)} />
              <span>{t('consent')}<small>{t('consentHint')}</small></span>
            </label>
          </div>

          <button className="btn" id="submit" type="submit" disabled={busy}>{busy ? t('submitting') : t('submit')}</button>
        </form>
      </div>

      <LostLink />
    </>
  );
}

/* ---------- Village input with suggestions from earlier entries ---------- */
function VillageInput({ value, onChange, villages }: { value: string; onChange: (v: string) => void; villages: string[] }) {
  const [open, setOpen] = useState(false);
  const [idx, setIdx] = useState(-1);
  const q = value.trim().toLowerCase();
  const items = q ? villages.filter(v => v.toLowerCase().includes(q) && v.toLowerCase() !== q)
    .sort((a, b) => a.toLowerCase().indexOf(q) - b.toLowerCase().indexOf(q)).slice(0, 8) : [];
  const show = open && items.length > 0;
  const pick = (v: string) => { onChange(v); setOpen(false); setIdx(-1); };

  return (
    <div className="ac">
      <input id="village" maxLength={100} autoComplete="off" role="combobox" aria-autocomplete="list"
        aria-expanded={show} aria-controls="village-list" value={value}
        onChange={e => { onChange(e.target.value); setOpen(true); setIdx(-1); }}
        onFocus={() => setOpen(true)} onBlur={() => setTimeout(() => setOpen(false), 150)}
        onKeyDown={e => {
          if (!show) return;
          if (e.key === 'ArrowDown') { setIdx(i => (i + 1) % items.length); e.preventDefault(); }
          else if (e.key === 'ArrowUp') { setIdx(i => (i - 1 + items.length) % items.length); e.preventDefault(); }
          else if (e.key === 'Enter' && idx >= 0) { pick(items[idx]); e.preventDefault(); }
          else if (e.key === 'Escape') setOpen(false);
        }} />
      <ul className={`ac-list${show ? ' open' : ''}`} id="village-list" role="listbox">
        {show && items.map((v, i) => {
          const at = v.toLowerCase().indexOf(q);
          return (
            <li key={v} role="option" aria-selected={i === idx} className={i === idx ? 'active' : ''}
              onPointerDown={e => { e.preventDefault(); pick(v); }}>
              {v.slice(0, at)}<mark>{v.slice(at, at + q.length)}</mark>{v.slice(at + q.length)}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/* ---------- "Lost my link" by email ---------- */
function LostLink() {
  const { t } = useLang();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState<{ text: string; info: boolean } | null>(null);
  const [busy, setBusy] = useState(false);

  async function send() {
    if (!EMAIL_RE.test(email.trim())) { setMsg({ text: t('emailErr'), info: false }); return; }
    setBusy(true);
    try {
      const r = await fetch('/api/recover', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }) });
      setMsg(r.ok ? { text: t('lostSent'), info: true } : { text: t('errGeneric'), info: false });
    } catch { setMsg({ text: t('errGeneric'), info: false }); }
    setBusy(false);
  }

  return (
    <>
      <div className="lost"><button type="button" className="linkbtn" onClick={() => setOpen(o => !o)}>{t('lostQ')}</button></div>
      {open && (
        <div className="card lost-panel" id="lostPanel">
          <h3>{t('lostTitle')}</h3>
          <p className="sub" style={{ margin: '0 0 12px' }}>{t('lostBody')}</p>
          <div className="row">
            <input id="lostEmail" type="email" inputMode="email" autoCapitalize="off" spellCheck={false} placeholder="name@gmail.com"
              value={email} onChange={e => setEmail(e.target.value)} autoFocus />
            <button type="button" className="btn small" id="lostBtn" disabled={busy} onClick={send}>{t('send')}</button>
          </div>
          {msg && <div className={`alert${msg.info ? ' info' : ''}`} id="lostMsg" style={{ display: 'block', margin: '12px 0 0' }}>{msg.text}</div>}
          <p className="sub" style={{ marginTop: 12 }}>{t('lostNoEmail')}</p>
        </div>
      )}
    </>
  );
}
