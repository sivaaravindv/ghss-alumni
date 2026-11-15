'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { BatchData } from '@/lib/alumni';
import { doingLabel } from '@/lib/i18n';
import { Header } from './Header';
import { CallIcon, WaIcon } from './icons';
import { useLang } from './LangProvider';

function initial(name: string, lang: string): string {
  name = name.trim();
  if (!name) return '?';
  try {
    const Seg = (Intl as unknown as { Segmenter?: new (l: string, o: object) => { segment(s: string): Iterable<{ segment: string }> } }).Segmenter;
    if (Seg) return [...new Seg(lang, { granularity: 'grapheme' }).segment(name)][0].segment.toUpperCase();
  } catch {}
  return name.charAt(0).toUpperCase();
}

export function BatchView({ data, token, justSaved }: { data: BatchData; token: string; justSaved: boolean }) {
  const { lang, t } = useLang();
  const me = data.me, y = me.year;
  const [active, setActive] = useState(y);
  const [show, setShow] = useState(me.showContact);
  const [saving, setSaving] = useState(false);
  const [toggleErr, setToggleErr] = useState(false);
  const [copied, setCopied] = useState(false);

  // Remember this person on this phone, and drop "?new=1" from the address bar
  useEffect(() => {
    try { localStorage.setItem('alumniToken', token); } catch {}
    if (justSaved) window.history.replaceState(null, '', `/b/${token}`);
  }, [token, justSaved]);

  const mine = data.groups[y] ?? [];
  const n = mine.length;
  const nudge = n <= 1 ? t('nudgeFirst', { year: y }) : n < 5 ? t('nudgeFew') : t('nudgeMany', { year: y });
  const years = [y - 1, y, y + 1].filter(yy => yy <= new Date().getFullYear());
  const list = data.groups[active] ?? [];
  const selfDigits = me.phone.replace(/\D/g, '');

  const inviteHref = 'https://api.whatsapp.com/send?text=' + encodeURIComponent(
    n <= 1 ? t('inviteMsg1', { year: y, url: data.shareUrl }) : t('inviteMsg', { year: y, n, url: data.shareUrl }));

  async function toggle(want: boolean) {
    setShow(want); setSaving(true); setToggleErr(false);
    try {
      const r = await fetch('/api/visibility', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ token, show: want }) });
      if (!r.ok) throw new Error();
    } catch { setShow(!want); setToggleErr(true); }
    setSaving(false);
  }

  async function copy() {
    const ok = () => { setCopied(true); setTimeout(() => setCopied(false), 2000); };
    try { await navigator.clipboard.writeText(me.link); ok(); }
    catch {
      const box = document.getElementById('linkBox') as HTMLInputElement | null;
      if (box) { box.select(); try { if (document.execCommand('copy')) ok(); } catch {} }
    }
  }

  return (
    <>
      <Header titleKey="batchTitle" subKey="batchSub" />

      {justSaved && <div className="toast">✓ <span>{t('saved')}</span></div>}

      <section className="card hero">
        <p className="hello">{t('hello', { name: me.name })}</p>
        <p className="label">{t('yourBatch')}</p>
        <div className="year">{y}</div>
        <p className="count" dangerouslySetInnerHTML={{ __html: n === 1 ? t('joined1') : t('joined', { n }) }} />
        <div className="nudge">{nudge}</div>
        <a className="btn wa" href={inviteHref} target="_blank" rel="noopener noreferrer"><WaIcon /><span>{t('invite')}</span></a>
      </section>

      <section className="card">
        <div className="tabs">
          {years.map(yy => (
            <button key={yy} type="button" className={`tab${yy === active ? ' active' : ''}`} onClick={() => setActive(yy)}>
              {yy}<small>{(data.groups[yy] ?? []).length} 👤</small>
            </button>
          ))}
        </div>
        {list.length ? (
          <ul className="members">
            {list.map((m, i) => {
              const digits = m.p.replace(/\D/g, '');
              return (
                <li key={i} className={`m${m.self ? ' self' : ''}`}>
                  <div className="av">{initial(m.n, lang)}</div>
                  <div className="mi">
                    <div className="mn">{m.n}{m.self && <span className="you">{t('you')}</span>}</div>
                    <div className="ms">{[m.v, doingLabel(m.d, lang)].filter(Boolean).join(' · ')}</div>
                    {m.p && !m.self && <div className="mp">{m.p}</div>}
                  </div>
                  <div className="ma">
                    {m.self ? null : digits ? (
                      <>
                        <a className="icon-btn call" href={`tel:+${digits}`} aria-label={t('call')}><CallIcon /></a>
                        <a className="icon-btn wa" href={`https://wa.me/${digits}`} target="_blank" rel="noopener noreferrer" aria-label={t('waTip')}><WaIcon /></a>
                      </>
                    ) : <span className="lock" title={t('hiddenNo')} aria-label={t('hiddenNo')}>🔒</span>}
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="empty">{t('emptyYear', { year: active })}
            <a className="btn wa small" href={inviteHref} target="_blank" rel="noopener noreferrer"><WaIcon /><span>{t('inviteThem', { year: active })}</span></a>
          </div>
        )}
      </section>

      <section className="card">
        <label className="switch">
          <span>{t('showMine')}<small>{t('showMineHint')}</small></span>
          <input type="checkbox" id="showToggle" checked={show} disabled={saving} onChange={e => toggle(e.target.checked)} />
        </label>
        {toggleErr && <div className="alert" style={{ display: 'block', margin: '12px 0 0' }}>{t('saveFail')}</div>}
      </section>

      <section className="card">
        <h3>{t('allBatches')}</h3>
        <p className="total" dangerouslySetInnerHTML={{ __html: t('totalAlumni', { n: data.total }) }} />
        <div className="chips">
          {data.batches.map(([yy, c]) => <span key={yy} className={`chip${yy === y ? ' mine' : ''}`}>{yy}<b>{c}</b></span>)}
        </div>
      </section>

      <section className="card savelink">
        <h3>{t('saveTitle')}</h3>
        <p>{t('saveBody')}</p>
        <input className="linkbox" id="linkBox" readOnly value={me.link} onClick={e => e.currentTarget.select()} />
        <div className="btn-row">
          <button type="button" className="btn secondary small" id="copyBtn" onClick={copy}>📋 <span>{copied ? t('copied') : t('copy')}</span></button>
          {selfDigits && (
            <a className="btn wa small" href={`https://wa.me/${selfDigits}?text=${encodeURIComponent(t('selfMsg', { link: me.link }))}`} target="_blank" rel="noopener noreferrer">
              <WaIcon /><span>{t('toMyWa')}</span>
            </a>
          )}
        </div>
      </section>

      <div className="center"><Link className="linkbtn" href="/">{t('registerAnother')}</Link></div>
    </>
  );
}
