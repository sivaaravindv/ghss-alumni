// Shared by the browser (instant feedback) and the server (the real check).

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
export const TOKEN_RE = /^[a-f0-9]{32}$/;
export const MIN_YEAR = 1950;

export function phoneValid(cc: string, digits: string): boolean {
  if (!/^\+\d{1,4}$/.test(cc)) return false;
  if (cc === '+91') return /^[6-9]\d{9}$/.test(digits);
  return /^\d{6,14}$/.test(digits) && cc.length - 1 + digits.length <= 15;
}

export type RegisterInput = {
  name: string; father: string; door: string; street: string; village: string;
  year: number; cc: string; phone: string; email: string; worked: string; current: string;
  showContact: boolean; lang: 'ta' | 'en';
};

export type CleanRecord = {
  name: string; father_name: string; door_no: string; street: string; village: string;
  passed_out_year: number; phone: string; email: string | null; worked_as: string | null;
  currently_doing: string; form_language: 'Tamil' | 'English'; show_contact: boolean;
};

/** Collapses spaces, trims, limits length. */
export function clean(v: unknown, max = 100): string {
  return String(v ?? '').replace(/\s+/g, ' ').trim().slice(0, max);
}

/** Returns a clean record, or an error code the page knows how to show. */
export function checkRegistration(raw: Partial<RegisterInput>):
  { ok: true; rec: CleanRecord } | { ok: false; code: 'required' | 'phone' | 'year' | 'email' } {
  const name = clean(raw.name), father = clean(raw.father), door = clean(raw.door, 20);
  const street = clean(raw.street), village = clean(raw.village), current = clean(raw.current, 150);
  const worked = clean(raw.worked), email = clean(raw.email, 120).toLowerCase();
  const cc = clean(raw.cc || '+91', 5), digits = String(raw.phone ?? '').replace(/\D/g, '').slice(0, 15);
  const year = Number(raw.year);

  if (!name || !father || !door || !street || !village || !current) return { ok: false, code: 'required' };
  if (!phoneValid(cc, digits)) return { ok: false, code: 'phone' };
  if (!Number.isInteger(year) || year < MIN_YEAR || year > new Date().getFullYear()) return { ok: false, code: 'year' };
  if (email && !EMAIL_RE.test(email)) return { ok: false, code: 'email' };

  return {
    ok: true,
    rec: {
      name, father_name: father, door_no: door, street, village, passed_out_year: year,
      phone: `${cc} ${digits}`, email: email || null, worked_as: worked || null,
      currently_doing: current, form_language: raw.lang === 'en' ? 'English' : 'Tamil',
      show_contact: raw.showContact === true
    }
  };
}
