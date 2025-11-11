"use client";

import { useState } from "react";

export type SeasonInput = {
  id?: string;
  product_id: string;
  label: string;
  slug: string;
  release_at?: string | null; // ISO
  status?: "confirmed"|"estimated"|"delayed"|null;
  source_url?: string|null;
  source_name?: string|null;
  cover_url?: string|null;
};

export default function SeasonForm({
  productId,
  initial,
  action
}: {
  productId: string;
  initial?: SeasonInput;
  action: (fd: FormData) => Promise<{ ok: boolean; error?: string }>;
}) {
  const [pending, setPending] = useState(false);

  return (
    <form
      action={async (fd) => {
        setPending(true);
        fd.set("product_id", productId);
        const res = await action(fd);
        setPending(false);
        if (!res.ok) alert(res.error);
        else history.back();
      }}
      className="space-y-3"
    >
      {initial?.id && <input type="hidden" name="id" defaultValue={initial.id} />}
      <input type="hidden" name="product_id" defaultValue={productId} />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label className="block text-xs opacity-70">Label</label>
          <input name="label" required defaultValue={initial?.label}
                 className="w-full rounded border border-border bg-background px-3 py-2"/>
        </div>
        <div>
          <label className="block text-xs opacity-70">Slug</label>
          <input name="slug" required defaultValue={initial?.slug}
                 className="w-full rounded border border-border bg-background px-3 py-2"/>
        </div>
        <div>
          <label className="block text-xs opacity-70">Release (ISO)</label>
          <input name="release_at" placeholder="2026-05-01T00:00:00Z" defaultValue={initial?.release_at ?? ""}
                 className="w-full rounded border border-border bg-background px-3 py-2"/>
        </div>
        <div>
          <label className="block text-xs opacity-70">Status</label>
          <select name="status" defaultValue={initial?.status ?? ""} className="w-full rounded border border-border bg-background px-3 py-2">
            <option value="">(none)</option>
            <option value="confirmed">confirmed</option>
            <option value="estimated">estimated</option>
            <option value="delayed">delayed</option>
          </select>
        </div>
        <div>
          <label className="block text-xs opacity-70">Source URL</label>
          <input name="source_url" defaultValue={initial?.source_url ?? ""}
                 className="w-full rounded border border-border bg-background px-3 py-2"/>
        </div>
        <div>
          <label className="block text-xs opacity-70">Source name</label>
          <input name="source_name" defaultValue={initial?.source_name ?? ""}
                 className="w-full rounded border border-border bg-background px-3 py-2"/>
        </div>
        <div className="sm:col-span-2">
          <label className="block text-xs opacity-70">Cover URL</label>
          <input name="cover_url" defaultValue={initial?.cover_url ?? ""}
                 className="w-full rounded border border-border bg-background px-3 py-2"/>
        </div>
      </div>

      <button disabled={pending}
              className="rounded bg-[color:var(--accent)] px-3 py-2 text-[color:var(--accent-foreground)]">
        {pending ? "Saving..." : "Save"}
      </button>
    </form>
  );
}

export async function upsertSeason(fd: FormData) {
  "use server";
  const { supabaseServerRoute } = await import("@/lib/supabase/route");
  const sb = await supabaseServerRoute();
  const { data: { user } } = await sb.auth.getUser();
  if (!user || user.email?.toLowerCase() !== "robertobaradel7@gmail.com") {
    return { ok: false, error: "Unauthorized" };
  }

  const payload = {
    id: fd.get("id")?.toString() || undefined,
    product_id: fd.get("product_id")!.toString(),
    label: fd.get("label")!.toString(),
    slug: fd.get("slug")!.toString(),
    release_at: (fd.get("release_at")?.toString() || null) as string|null,
    status: (fd.get("status")?.toString() || null) as "confirmed"|"estimated"|"delayed"|null,
    source_url: fd.get("source_url")?.toString() || null,
    source_name: fd.get("source_name")?.toString() || null,
    cover_url: fd.get("cover_url")?.toString() || null
  };

  if (payload.id) {
    const { error } = await sb.from("seasons").update(payload).eq("id", payload.id);
    if (error) return { ok: false, error: error.message };
  } else {
    const { error } = await sb.from("seasons").insert(payload);
    if (error) return { ok: false, error: error.message };
  }

  try {
    await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/revalidate`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-secret": process.env.REVALIDATE_SECRET! },
      body: JSON.stringify({ tag: "upcoming" })
    });
  } catch {}

  return { ok: true };
}
