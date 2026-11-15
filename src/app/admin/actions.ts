'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { ADMIN_COOKIE, ADMIN_MAX_AGE, keyOk, sessionValue } from '@/lib/admin';

export async function login(formData: FormData) {
  const key = String(formData.get('key') ?? '').trim();
  if (!keyOk(key)) {
    console.warn('[admin] failed sign-in');
    await new Promise(r => setTimeout(r, 800)); // slow down guessing
    redirect('/admin?e=1');
  }
  (await cookies()).set(ADMIN_COOKIE, sessionValue(), {
    httpOnly: true, secure: true, sameSite: 'strict', path: '/', maxAge: ADMIN_MAX_AGE
  });
  redirect('/admin');
}

export async function logout() {
  (await cookies()).delete(ADMIN_COOKIE);
  redirect('/admin');
}
