import { supabaseServerRoute } from "@/lib/supabase/route";
import { NextResponse } from "next/server";

export async function POST(_: Request, { params }: { params: { locale: "es"|"en" } }) {
  const sb = await supabaseServerRoute();
  await sb.auth.signOut();
  return NextResponse.redirect(new URL(`/${params.locale}`, process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"));
}
