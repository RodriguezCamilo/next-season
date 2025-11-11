import type { Metadata } from 'next';
import { supabaseServer } from '@/lib/supabase';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import Image from 'next/image';

type Params = { locale: 'es'|'en'; slug: string; season: string };

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { locale, slug, season } = await params;
  const sb = supabaseServer();
  const { data } = await sb
    .from('v_upcoming')
    .select('*')
    .eq('category_slug', 'games')
    .eq('item_slug', slug)
    .eq('slug', season)
    .single();

  if (!data) return { title: 'Next Season' };

  const title = `${data.item_title} — ${data.label}`;
  const desc =
    data.release_at
      ? (locale === 'en'
          ? `Countdown and premiere date: ${data.item_title} — ${data.label}`
          : `Cuenta regresiva y fecha de estreno: ${data.item_title} — ${data.label}`)
      : (locale === 'en'
          ? `Date TBA: ${data.item_title} — ${data.label}`
          : `Fecha por confirmar: ${data.item_title} — ${data.label}`);

  return {
    title,
    description: desc,
    openGraph: {
      title, description: desc,
      images: [{ url: data.cover_url ?? '/og-default.png' }]
    },
    twitter: {
      card: 'summary_large_image',
      title, description: desc,
      images: [data.cover_url ?? '/og-default.png']
    }
  };
}

export default async function Page({ params }: { params: Promise<Params> }) {
  const { locale, slug, season } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'home' });

  const { data } = await supabaseServer()
    .from('v_upcoming')
    .select('*')
    .eq('category_slug', 'series')
    .eq('item_slug', slug)
    .eq('slug', season)
    .single();

  if (!data) return <div className="max-w-3xl mx-auto p-6">Not found</div>;

  return (
    <article className="mx-auto max-w-3xl p-6">
      <div className="relative aspect-[16/9] overflow-hidden rounded-xl border border-border bg-card">
        {data.cover_url && (
          <Image src={data.cover_url} alt={`${data.item_title} cover`} fill className="object-cover" />
        )}
      </div>

      <h1 className="mt-6 text-2xl md:text-3xl font-semibold">
        {data.item_title} — {data.label}
      </h1>

      <p className="mt-2 text-sm text-muted-foreground">
        {data.release_at
          ? new Date(data.release_at).toLocaleString(locale)
          : (locale === 'en' ? 'To be announced' : 'Por confirmar')}
      </p>

      {data.description && (
        <p className="mt-4 leading-relaxed">{data.description}</p>
      )}

      <div className="mt-6 flex flex-wrap items-center gap-3">
        {data.source_url && (
          <a href={data.source_url} target="_blank" className="text-sm underline decoration-dotted underline-offset-4">
            {(locale === 'en' ? 'Source' : 'Fuente')}{data.source_name ? `: ${data.source_name}` : ''}
          </a>
        )}
        {data.official_url && (
          <a href={data.official_url} target="_blank" className="text-sm rounded-full border px-3 py-1 hover:bg-accent">
            {locale === 'en' ? 'Official site' : 'Sitio oficial'}
          </a>
        )}
      </div>

      {/* JSON-LD básico */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Event',
            name: `${data.item_title} — ${data.label}`,
            startDate: data.release_at ?? undefined,
            eventStatus: data.status === 'delayed' ? 'EventPostponed' : 'EventScheduled',
            url: typeof window !== 'undefined' ? window.location.href : undefined,
            image: data.cover_url ?? undefined
          })
        }}
      />
    </article>
  );
}
