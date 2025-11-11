import { supabaseServer } from '@/lib/supabase/supabase';

export default async function sitemap() {
  const sb = supabaseServer();
  const { data } = await sb.from('v_upcoming').select('category_slug,item_slug,slug').limit(500);
  const locales = ['es','en'] as const;

  const routes = [
    ...locales.map((l) => ({ url: `https://nextseason.app/${l}`, lastModified: new Date().toISOString() })),
    ...(data ?? []).flatMap((r) =>
      locales.map((l) => ({
        url: `https://nextseason.app/${l}/${r.category_slug}/${r.item_slug}/${r.slug}`,
        lastModified: new Date().toISOString()
      }))
    )
  ];
  return routes;
}
