import Link from "next/link";
import { supabaseServerRSC } from "@/lib/supabase/rsc";
import { deleteProduct } from "./actions";
import DeleteConfirmButton from "./_deleteConfirmButton";
export default async function ProductsPage({
  params,
}: {
  params: Promise<{ locale: "es" | "en" }>;
}) {
  const { locale } = await params;
  const sb = await supabaseServerRSC();
  const { data } = await sb.from("products").select("*").order("title");

  // Server Action que SÍ respeta el tipo (Promise<void>)
  async function deleteAction(formData: FormData): Promise<void> {
    "use server";
    const id = formData.get("id")?.toString();
    if (!id) throw new Error("Missing id");
    const res = await deleteProduct(id);
    if (!res.ok) throw new Error(res.error || "Delete failed");
    // opcional: revalidatePath aquí si querés, pero ya lo hacés en la action
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold">Products</h1>
        <Link
          href={`/${locale}/admin/products/new`}
          className="rounded bg-[color:var(--accent)] px-3 py-1.5 text-sm text-[color:var(--accent-foreground)]"
        >
          New product
        </Link>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="border-b border-border text-left">
            <tr>
              <th className="px-3 py-2">Title</th>
              <th className="px-3 py-2">Slug</th>
              <th className="px-3 py-2">Category</th>
              <th className="px-3 py-2 w-32"></th>
            </tr>
          </thead>
          <tbody>
            {(data ?? []).map((p) => (
              <tr key={p.id} className="border-b border-border/60">
                <td className="px-3 py-2">{p.title}</td>
                <td className="px-3 py-2">{p.slug}</td>
                <td className="px-3 py-2">{p.category}</td>
                <td className="px-3 py-2 text-right">
                  <Link
                    href={`/${locale}/admin/products/${p.id}/edit`}
                    className="rounded border px-2 py-1 hover:bg-accent/10"
                  >
                    Edit
                  </Link>
                  <Link
                    href={`/${locale}/admin/products/${p.id}/seasons`}
                    className="ml-2 rounded border px-2 py-1 hover:bg-accent/10"
                  >
                    Seasons
                  </Link>

                  {/* 🔧 Ahora el form usa una Server Action válida */}
                  <form action={deleteAction} className="inline-block ml-2">
                    <input type="hidden" name="id" value={p.id} />
                    <DeleteConfirmButton />
                  </form>
                </td>
              </tr>
            ))}
            {(!data || data.length === 0) && (
              <tr>
                <td className="px-3 py-3 text-muted-foreground" colSpan={4}>
                  No products yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
