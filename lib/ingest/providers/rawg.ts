import { upsertAutoSeason } from "../upsert";

export async function syncFromRAWG(p: any) {
  if (!p.provider_id || !process.env.RAWG_KEY) return { changed: false };
  const r = await fetch(`https://api.rawg.io/api/games/${p.provider_id}?key=${process.env.RAWG_KEY}`);
  if (!r.ok) return { changed: false };
  const g = await r.json();

  const release_at = g.released ? new Date(g.released).toISOString() : null;

  return upsertAutoSeason(p, {
    label: "Release",
    release_at,
    status: release_at ? "confirmed" : "estimated",
    source_name: "RAWG",
    source_url: `https://rawg.io/games/${g.slug ?? p.provider_id}`,
    cover_url: g.background_image ?? null
  });
}
