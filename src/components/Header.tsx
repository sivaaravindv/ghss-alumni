'use client';
import type { Key } from '@/lib/i18n';
import { useLang } from './LangProvider';

export function Header({ titleKey, subKey }: { titleKey: Key; subKey: Key }) {
  const { lang, setLang, t } = useLang();
  return (
    <header>
      <div>
        <p className="school">{t('school')}</p>
        <h1>{t(titleKey)}</h1>
        <p className="sub">{t(subKey)}</p>
      </div>
      <div className="lang">
        <button type="button" className={lang === 'ta' ? 'active' : ''} onClick={() => setLang('ta')}>தமிழ்</button>
        <button type="button" className={lang === 'en' ? 'active' : ''} onClick={() => setLang('en')}>EN</button>
      </div>
    </header>
  );
}
