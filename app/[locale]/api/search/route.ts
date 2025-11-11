// src/app/api/search/route.ts (o /[locale]/api/search)
import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") || "").trim();
  const category = searchParams.get("category") || "";

  const sb = supabaseServer();
  let query = sb
    .from("v_upcoming")
    .select("title,season_label,category,product_slug")
    .limit(20);

  if (q) query = query.or(`title.ilike.%${q}%,season_label.ilike.%${q}%`);
  if (category) query = query.eq("category", category);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const results = (data ?? []).map((r) => ({
    label: r.season_label ? `${r.title} • ${r.season_label}` : r.title,
    href: `/${r.category}/${r.product_slug}`,
    meta: r.category as string,
  }));

  return NextResponse.json({ results });
}
