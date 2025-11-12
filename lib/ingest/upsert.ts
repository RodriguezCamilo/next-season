import { supabaseService } from "@/lib/supabase/supabase";

type Status = "confirmed" | "estimated" | "delayed";

export async function upsertAutoSeason(product: any, auto: {
  label: string;
  release_at: string | null;
  status: Status;
  source_name: string | null;
  source_url: string | null;
  cover_url: string | null;
}) {
  const sb = supabaseService();
  const nowIso = new Date().toISOString();

  // Buscar season futura más cercana (o null)
  const { data: seasons } = await sb
    .from("seasons")
    .select("*")
    .eq("product_id", product.id)
    .order("release_at", { ascending: true, nullsFirst: true });

  const next = seasons?.find(s => !s.release_at || new Date(s.release_at) > new Date()) ?? null;

  const payload = {
    label: next?.label ?? auto.label,
    release_at: product.manual_release_at ?? auto.release_at,
    status: (product.manual_status ?? auto.status) as Status,
    source_name: product.manual_source_name ?? auto.source_name,
    source_url: product.manual_source_url ?? auto.source_url,
    cover_url: auto.cover_url ?? product.cover_url
  };

  let changed = false;

  if (next) {
    const before = JSON.stringify([
      next.label, next.release_at, next.status, next.source_name, next.source_url, next.cover_url
    ]);
    const after  = JSON.stringify([
      payload.label, payload.release_at, payload.status, payload.source_name, payload.source_url, payload.cover_url
    ]);

    if (before !== after) {
      const { error } = await sb.from("seasons").update(payload).eq("id", next.id);
      if (!error) changed = true;
    }
  } else {
    const { error } = await sb.from("seasons").insert({
      product_id: product.id,
      slug: createSeasonSlug(payload.label),
      ...payload
    });
    if (!error) changed = true;
  }

  await sb.from("products").update({ last_checked_at: nowIso, ...(changed ? { last_change_at: nowIso } : {}) }).eq("id", product.id);

  if (changed) {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/revalidate`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-secret": process.env.REVALIDATE_SECRET! },
        body: JSON.stringify({ tag: "upcoming" })
      });
    } catch {}
  }

  return { changed };
}

function createSeasonSlug(label: string) {
  return label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}
