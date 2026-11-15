'use client';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { tr, type Key, type Lang } from '@/lib/i18n';

type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: (k: Key, vars?: Record<string, string | number>) => string };
const LangCtx = createContext<Ctx | null>(null);

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>('ta');

  useEffect(() => {
    try { const saved = localStorage.getItem('formLang'); if (saved === 'en' || saved === 'ta') setLangState(saved); } catch {}
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.body.classList.toggle('ta', lang === 'ta');
  }, [lang]);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try { localStorage.setItem('formLang', l); } catch {}
  }, []);

  const t = useCallback((k: Key, vars?: Record<string, string | number>) => tr(lang, k, vars), [lang]);
  return <LangCtx.Provider value={{ lang, setLang, t }}>{children}</LangCtx.Provider>;
}

export function useLang(): Ctx {
  const c = useContext(LangCtx);
  if (!c) throw new Error('useLang outside LangProvider');
  return c;
}
