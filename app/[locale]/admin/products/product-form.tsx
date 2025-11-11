"use client";

import { useState } from "react";

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
};

export default function ProductForm({
  initial,
  action
}: {
  initial?: ProductInput;
  action: (formData: FormData) => Promise<{ ok: boolean; error?: string }>;
}) {
  const [pending, setPending] = useState(false);

  return (
    <form
      action={async (fd) => {
        setPending(true);
        const res = await action(fd);
        setPending(false);

        if (!res.ok) {
          alert(res.error);
        } else {
          // Volver al listado
          location.assign("../");
        }
      }}
      className="space-y-3"
    >
      {initial?.id && (
        <input type="hidden" name="id" defaultValue={initial.id} />
      )}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label className="block text-xs opacity-70">Title</label>
          <input
            name="title"
            required
            defaultValue={initial?.title}
            className="w-full rounded border border-border bg-background px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-xs opacity-70">Slug</label>
          <input
            name="slug"
            required
            defaultValue={initial?.slug}
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
          <label className="block text-xs opacity-70">Source URL</label>
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

      <button
        disabled={pending}
        className="rounded bg-[color:var(--accent)] px-3 py-2 text-[color:var(--accent-foreground)]"
      >
        {pending ? "Saving..." : "Save"}
      </button>
    </form>
  );
}
