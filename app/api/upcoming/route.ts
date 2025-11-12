// app/api/upcoming/route.ts
import { supabaseServer } from "@/lib/supabase/supabase";

export const revalidate = 0;

type Category = "game" | "show" | "anime" | "esport";
type UITab = "games" | "shows" | "anime" | "esports";

type VUpcomingRow = {
  product_id: string | null;
  product_slug: string;
  title: string;
  season_label: string | null;
  category: Category;
  season_slug: string | null;
  cover_url: string | null;
  release_at: string | null; // ISO
  status: "confirmed" | "estimated" | "delayed" | null;
  source_name: string | null;
  source_url: string | null;
};

export type Item = {
  key: string;
  title: string;
  label: string | null;
  category: Category;
  itemSlug: string;
  seasonSlug: string | null;
  coverUrl: string | null;
  dateIso: string | null;
  status: "confirmed" | "estimated" | "delayed" | null;
  sourceName: string | null;
  sourceUrl: string | null;
};

const map: Record<UITab, Category> = {
  games: "game",
  shows: "show",
  anime: "anime",
  esports: "esport",
};

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const c = searchParams.get("c") as UITab | null;
  const from = Number(searchParams.get("from") ?? "0");
  const limit = 24;

  const sb = supabaseServer();

  let q = sb.from("v_upcoming").select("*").range(from, from + limit - 1);
  if (c && map[c]) q = q.eq("category", map[c]);

  const { data, error } = await q as unknown as {
    data: VUpcomingRow[] | null;
    error: { message: string } | null;
  };

  if (error) return Response.json({ error: error.message }, { status: 400 });

  const items: Item[] = (data ?? []).map((r) => ({
    key: (r.product_id ?? r.product_slug) as string,
    title: r.title,
    label: r.season_label,
    category: r.category,
    itemSlug: r.product_slug,
    seasonSlug: r.season_slug,
    coverUrl: r.cover_url,
    dateIso: r.release_at,
    status: r.status,
    sourceName: r.source_name,
    sourceUrl: r.source_url,
  }));

  return Response.json(items);
}
