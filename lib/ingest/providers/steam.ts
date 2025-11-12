import { upsertAutoSeason } from "../upsert";

export async function syncFromSteam(p: any) {
  if (!p.provider_id) return { changed: false };
  const r = await fetch(`https://store.steampowered.com/api/appdetails?appids=${p.provider_id}`);
  if (!r.ok) return { changed: false };
  const data = await r.json();
  const obj = data?.[p.provider_id]?.data;
  if (!obj) return { changed: false };

  const coming = obj.release_date?.coming_soon;
  const dateStr = obj.release_date?.date; // texto tipo "1 Jan, 2026" (no siempre ISO)
  const release_at = !coming && dateStr ? new Date(dateStr).toISOString() : null;

  return upsertAutoSeason(p, {
    label: "Release",
    release_at,
    status: release_at ? "confirmed" : "estimated",
    source_name: "Steam",
    source_url: `https://store.steampowered.com/app/${p.provider_id}`,
    cover_url: obj.header_image ?? null
  });
}
