import { redirect } from "next/navigation";
import { upsertProduct } from "./actions";
import ProductSyncButton from "./ProductSyncButton.client"; // ← importa el cliente directo

export type ProductInput = {
  id?: string;
  title: string;
  slug: string;
  category: "game" | "show" | "anime" | "esport";
  description?: string | null;
  official_url?: string | null;
  source_url?: string | null;
  source_name?: string | null;
  cover_url?: string | null;
  provider?: "tmdb" | "anilist" | "rawg" | "steam" | "custom" | "none";
  provider_id?: string | null;
  auto_enabled?: boolean;
  manual_release_at?: string | null;
  manual_status?: "" | "confirmed" | "estimated" | "delayed";
  manual_source_name?: string | null;
  manual_source_url?: string | null;
};

export default function ProductFormServer({
  initial,
  locale,
}: {
  initial?: ProductInput;
  locale: "es" | "en";
}) {
  async function submitAction(formData: FormData): Promise<void> {
    "use server";
    const res = await upsertProduct(formData);
    if (!res.ok) throw new Error(res.error);
    redirect(`/${locale}/admin/products`);
  }

  return (
    <form action={submitAction} className="space-y-4">
      {initial?.id && <input type="hidden" name="id" defaultValue={initial.id} />}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label className="block text-xs opacity-70">Title</label>
          <input
            name="title"
            required
            defaultValue={initial?.title ?? ""}
            className="w-full rounded border border-border bg-background px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-xs opacity-70">Slug</label>
          <input
            name="slug"
            required
            defaultValue={initial?.slug ?? ""}
            className="w-full rounded border border-border bg-background px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-xs opacity-70">Category</label>
          <select
            name="category"
            defaultValue={initial?.category ?? "show"}
            className="w-full rounded border border-border bg-background px-3 py-2"
          >
            <option value="game">game</option>
            <option value="show">show</option>
            <option value="anime">anime</option>
            <option value="esport">esport</option>
          </select>
        </div>

        <div>
          <label className="block text-xs opacity-70">Official URL</label>
          <input
            name="official_url"
            defaultValue={initial?.official_url ?? ""}
            className="w-full rounded border border-border bg-background px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-xs opacity-70">Source URL (public)</label>
          <input
            name="source_url"
            defaultValue={initial?.source_url ?? ""}
            className="w-full rounded border border-border bg-background px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-xs opacity-70">Source name</label>
          <input
            name="source_name"
            defaultValue={initial?.source_name ?? ""}
            className="w-full rounded border border-border bg-background px-3 py-2"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-xs opacity-70">Cover URL</label>
          <input
            name="cover_url"
            defaultValue={initial?.cover_url ?? ""}
            className="w-full rounded border border-border bg-background px-3 py-2"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-xs opacity-70">Description</label>
          <textarea
            name="description"
            rows={4}
            defaultValue={initial?.description ?? ""}
            className="w-full rounded border border-border bg-background px-3 py-2"
          />
        </div>
      </div>

      {/* Automatización */}
      <div className="rounded-xl border border-border bg-card p-4">
        <h3 className="mb-2 font-semibold">Automation</h3>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label className="block text-xs opacity-70">Provider</label>
            <select
              name="provider"
              defaultValue={initial?.provider ?? "none"}
              className="w-full rounded border border-border bg-background px-3 py-2"
            >
              <option value="none">(none)</option>
              <option value="tmdb">tmdb</option>
              <option value="anilist">anilist</option>
              <option value="rawg">rawg</option>
              <option value="steam">steam</option>
              <option value="custom">custom</option>
            </select>
          </div>

          <div>
            <label className="block text-xs opacity-70">Provider ID</label>
            <input
              name="provider_id"
              defaultValue={initial?.provider_id ?? ""}
              className="w-full rounded border border-border bg-background px-3 py-2"
              placeholder="TMDB tv id / AniList id / RAWG slug / Steam appid"
            />
          </div>

          {/* hidden fallback para checkbox */}
          <input type="hidden" name="auto_enabled" value="off" />
          <div className="flex items-center gap-2">
            <input
              id="auto_enabled"
              name="auto_enabled"
              type="checkbox"
              defaultChecked={initial?.auto_enabled ?? true}
              value="on"
              className="h-4 w-4"
            />
            <label htmlFor="auto_enabled" className="text-sm">
              Auto enabled
            </label>
          </div>

          {/* Botón de sync solo al editar */}
          {initial?.id && (
            <div className="text-right">
              <ProductSyncButton id={initial.id} />
            </div>
          )}
        </div>
      </div>

      {/* Overrides manuales */}
      <div className="rounded-xl border border-border bg-card p-4">
        <h3 className="mb-2 font-semibold">Manual overrides (optional)</h3>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label className="block text-xs opacity-70">Manual release (ISO)</label>
            <input
              name="manual_release_at"
              placeholder="2026-05-01T00:00:00Z"
              defaultValue={initial?.manual_release_at ?? ""}
              className="w-full rounded border border-border bg-background px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-xs opacity-70">Manual status</label>
            <select
              name="manual_status"
              defaultValue={initial?.manual_status ?? ""}
              className="w-full rounded border border-border bg-background px-3 py-2"
            >
              <option value="">(none)</option>
              <option value="confirmed">confirmed</option>
              <option value="estimated">estimated</option>
              <option value="delayed">delayed</option>
            </select>
          </div>
          <div>
            <label className="block text-xs opacity-70">Manual source name</label>
            <input
              name="manual_source_name"
              defaultValue={initial?.manual_source_name ?? ""}
              className="w-full rounded border border-border bg-background px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-xs opacity-70">Manual source URL</label>
            <input
              name="manual_source_url"
              defaultValue={initial?.manual_source_url ?? ""}
              className="w-full rounded border border-border bg-background px-3 py-2"
            />
          </div>
        </div>
      </div>

      <button className="rounded bg-[color:var(--accent)] px-3 py-2 text-[color:var(--accent-foreground)]">
        Save
      </button>
    </form>
  );
}
