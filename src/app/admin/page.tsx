import type { Metadata } from 'next';
import { exportAll } from '@/lib/alumni';
import { isAdmin } from '@/lib/admin';
import { AdminView, type AdminRow } from '@/components/AdminView';
import { login } from './actions';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Admin | GHSS Vellalankulam Alumni', robots: { index: false, follow: false } };

export default async function AdminPage(props: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const sp = await props.searchParams;

  if (!(await isAdmin())) {
    return (
      <div className="admin admin-login">
        <header><h1>Alumni admin</h1></header>
        <div className="card">
          {sp.e === '1' && <div className="alert" style={{ display: 'block' }}>Wrong admin key.</div>}
          <form action={login}>
            <div className="field">
              <label htmlFor="key">Admin key</label>
              <input id="key" name="key" type="password" autoComplete="current-password" required autoFocus />
            </div>
            <button className="btn" type="submit">Sign in</button>
          </form>
        </div>
      </div>
    );
  }

  const rows = (await exportAll()) as unknown as AdminRow[];
  return <AdminView rows={rows} />;
}
