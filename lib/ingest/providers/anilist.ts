import { upsertAutoSeason } from "../upsert";

export async function syncFromAniList(p: any) {
  if (!p.provider_id) return { changed: false };

  const query = `
  query ($id: Int) {
    Media(id: $id, type: ANIME) {
      id title { romaji } coverImage { extraLarge } nextAiringEpisode { airingAt episode }
      siteUrl
    }
  }`;

  const r = await fetch("https://graphql.anilist.co", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables: { id: Number(p.provider_id) } })
  });
  if (!r.ok) return { changed: false };

  const { data } = await r.json();
  const m = data?.Media;
  if (!m) return { changed: false };

  const label = m.nextAiringEpisode ? `Episode ${m.nextAiringEpisode.episode}` : "Next season";
  const release_at = m.nextAiringEpisode ? new Date(m.nextAiringEpisode.airingAt * 1000).toISOString() : null;

  return upsertAutoSeason(p, {
    label,
    release_at,
    status: release_at ? "confirmed" : "estimated",
    source_name: "AniList",
    source_url: m.siteUrl,
    cover_url: m.coverImage?.extraLarge ?? null
  });
}
