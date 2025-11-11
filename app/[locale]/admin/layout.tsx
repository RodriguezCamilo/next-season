import { redirect, notFound } from 'next/navigation';
import { supabaseServerRSC } from '@/lib/supabase/rsc';
import { ADMIN_EMAILS } from '@/app/config/admin';

export default async function AdminLayout({
  children,
  params
}: { children: React.ReactNode; params: Promise<{ locale: 'es'|'en' }> }) {
  const { locale } = await params;
  const sb = await supabaseServerRSC();
  const { data: { user } } = await sb.auth.getUser();

  if (!user) {
    redirect(`/${locale}/admin/sign-in?next=/${locale}/admin`);
  }
  if (!user.email || !ADMIN_EMAILS.has(user.email)) {
    notFound(); // o redirect a home
  }

  return <>{children}</>;
}
