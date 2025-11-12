// app/api/cron/sync/route.ts
import { NextResponse } from "next/server";
import { supabaseService } from "@/lib/supabase/supabase";
import { syncProductByProvider } from "@/lib/ingest";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const headerSecret = req.headers.get("x-cron-secret");
  const querySecret = url.searchParams.get("key");
  const isVercelCron = req.headers.has("x-vercel-cron");
  const ok =
    headerSecret === process.env.CRON_SECRET ||
    querySecret === process.env.CRON_SECRET ||
    isVercelCron;

  if (!ok) return new NextResponse("Unauthorized", { status: 401 });

  const sb = supabaseService();
  const { data: products, error } = await sb
    .from("products")
    .select("*")
    .eq("auto_enabled", true);

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  let updated = 0;
  for (const p of products ?? []) {
    try {
      const res = await syncProductByProvider(p);
      if (res.changed) updated++;
    } catch {}
  }

  return NextResponse.json({ ok: true, updated });
}
