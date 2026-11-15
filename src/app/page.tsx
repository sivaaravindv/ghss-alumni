import { RegisterForm } from '@/components/RegisterForm';
import { listVillages } from '@/lib/alumni';

// Village suggestions are refreshed every 5 minutes
export const revalidate = 300;

export default async function Home() {
  const villages = await listVillages().catch(e => { console.error('[villages]', e); return [] as string[]; });
  return <RegisterForm villages={villages} />;
}
