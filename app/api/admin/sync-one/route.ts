import { NextResponse } from "next/server";
import { supabaseService } from "@/lib/supabase/supabase";
import { syncProductByProvider } from "@/lib/ingest/index";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  // Podés agregar auth de admin si querés reforzar acá
  const { id } = await req.json();
  if (!id) return NextResponse.json({ ok: false, error: "Missing id" }, { status: 400 });

  const sb = supabaseService();
  const { data: p, error } = await sb.from("products").select("*").eq("id", id).single();
  if (error || !p) return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });

  const res = await syncProductByProvider(p);
  return NextResponse.json({ ok: true, ...res });
}
