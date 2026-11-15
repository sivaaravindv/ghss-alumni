import type { Metadata } from 'next';
import { BatchView } from '@/components/BatchView';
import { RegisterForm } from '@/components/RegisterForm';
import { getBatch, listVillages } from '@/lib/alumni';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function BatchPage(props: {
  params: Promise<{ token: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { token: raw } = await props.params;
  const sp = await props.searchParams;
  const token = raw.toLowerCase();
  const data = await getBatch(token);
  if (!data) {
    const villages = await listVillages().catch(() => [] as string[]);
    return <RegisterForm villages={villages} badLink />;
  }
  return <BatchView data={data} token={token} justSaved={sp.new === '1'} />;
}
