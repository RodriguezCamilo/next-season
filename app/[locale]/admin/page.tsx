import { supabaseServerRSC } from "@/lib/supabase/rsc";

export default async function AdminHome() {
  const sb = await supabaseServerRSC();
  const [{ count: products }, { count: seasons }] = await Promise.all([
    sb.from("products").select("*", { count: "exact", head: true }),
    sb.from("seasons").select("*", { count: "exact", head: true })
  ]);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div className="rounded-xl border border-border bg-card p-5">
        <div className="text-sm text-muted-foreground">Products</div>
        <div className="text-3xl font-semibold mt-1">{products ?? 0}</div>
      </div>
      <div className="rounded-xl border border-border bg-card p-5">
        <div className="text-sm text-muted-foreground">Seasons</div>
        <div className="text-3xl font-semibold mt-1">{seasons ?? 0}</div>
      </div>
    </div>
  );
}
