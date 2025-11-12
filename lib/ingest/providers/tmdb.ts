import { upsertAutoSeason } from "../upsert";

export async function syncFromTMDB(p: any) {
  if (!p.provider_id) return { changed: false };
  const r = await fetch(
    `https://api.themoviedb.org/3/tv/${p.provider_id}?append_to_response=next_episode_to_air,seasons&language=en-US`,
    { headers: { Authorization: `Bearer ${process.env.TMDB_BEARER!}` } }
  );
  if (!r.ok) return { changed: false };
  const tv = await r.json();

  const next = tv.next_episode_to_air
    ? { label: `S${tv.next_episode_to_air.season_number}`, date: tv.next_episode_to_air.air_date }
    : (tv.seasons ?? []).find((s: any) => s.air_date && new Date(s.air_date) > new Date());

  if (!next) return { changed: false };

  const release_at = next.date ? new Date(next.date).toISOString() : null;
  const label = next.label ?? (next.name || `Season ${next.season_number}`);
  const status = release_at ? "confirmed" : "estimated";
  const cover = tv.poster_path ? `https://image.tmdb.org/t/p/w780${tv.poster_path}` : null;

  return upsertAutoSeason(p, {
    label,
    release_at,
    status,
    source_name: "TMDB",
    source_url: `https://www.themoviedb.org/tv/${p.provider_id}`,
    cover_url: cover
  });
}
