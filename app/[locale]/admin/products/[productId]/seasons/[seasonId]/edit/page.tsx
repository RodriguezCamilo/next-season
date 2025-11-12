import { supabaseServerRSC } from "@/lib/supabase/rsc";
import SeasonForm, { upsertSeason } from "../../season-form";

export default async function EditSeasonPage({
  params
}: { params: Promise<{ productId: string; seasonId: string }> }) {
  const { productId, seasonId } = await params;
  const sb = await supabaseServerRSC();
  const { data: s } = await sb.from("seasons").select("*").eq("id", seasonId).single();

  return (
    <div className=" flex flex-1 flex-col items-center">
      <h1 className="mb-4 text-xl font-semibold">Edit season</h1>
      <SeasonForm action={upsertSeason} productId={productId} initial={s ?? undefined} />
    </div>
  );
}
