// app/sitemap.ts
import { supabaseServer } from "@/lib/supabase/supabase";

export default async function sitemap() {
  const sb = supabaseServer();
  const { data } = await sb
    .from("products")
    .select("slug, category")
    .limit(2000);

  const locales = ["es", "en"] as const;
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://SeasonTrack.app";
  const now = new Date().toISOString();

  const routes = [
    // Home por idioma
    ...locales.map((l) => ({
      url: `${base}/${l}`,
      lastModified: now,
    })),
    // Todas las fichas de producto
    ...(data ?? []).flatMap((p) =>
      locales.map((l) => ({
        url: `${base}/${l}/${p.category}/${p.slug}`,
        lastModified: now,
      }))
    ),
  ];

  return routes;
}
