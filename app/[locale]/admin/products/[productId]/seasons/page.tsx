import Link from "next/link";
import { supabaseServerRSC } from "@/lib/supabase/rsc";

export default async function SeasonsPage({
  params
}: { params: Promise<{ locale:"es"|"en"; productId: string }> }) {
  const { locale, productId } = await params;
  const sb = await supabaseServerRSC();

  const [{ data: product }, { data: seasons }] = await Promise.all([
    sb.from("products").select("*").eq("id", productId).single(),
    sb.from("seasons").select("*").eq("product_id", productId).order("release_at", { ascending: true, nullsFirst: true })
  ]);

  if (!product) return <div>Product not found.</div>;

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold">{product.title} — Seasons</h1>
        <Link
          href={`/${locale}/admin/products/${product.id}/seasons/new`}
          className="rounded bg-[color:var(--accent)] px-3 py-1.5 text-sm text-[color:var(--accent-foreground)]"
        >
          New season
        </Link>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="border-b border-border text-left">
            <tr>
              <th className="px-3 py-2">Label</th>
              <th className="px-3 py-2">Slug</th>
              <th className="px-3 py-2">Release</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2 w-24"></th>
            </tr>
          </thead>
          <tbody>
            {(seasons ?? []).map(s => (
              <tr key={s.id} className="border-b border-border/60">
                <td className="px-3 py-2">{s.label}</td>
                <td className="px-3 py-2">{s.slug}</td>
                <td className="px-3 py-2">{s.release_at ?? "-"}</td>
                <td className="px-3 py-2">{s.status ?? "-"}</td>
                <td className="px-3 py-2 text-right">
                  <Link
                    href={`/${locale}/admin/products/${product.id}/seasons/${s.id}/edit`}
                    className="rounded border px-2 py-1 hover:bg-accent/10"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
            {(!seasons || seasons.length === 0) && (
              <tr><td className="px-3 py-3 text-muted-foreground" colSpan={5}>No seasons yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
