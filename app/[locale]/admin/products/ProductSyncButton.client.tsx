"use client";

import { useState } from "react";

export default function ProductSyncButton({ id }: { id: string }) {
  const [pending, setPending] = useState(false);

  return (
    <button
      type="button"
      disabled={pending}
      className="rounded border px-3 py-2 text-sm hover:bg-accent/10 disabled:opacity-60"
      onClick={async () => {
        if (!confirm("Sync this product now?")) return;
        setPending(true);
        try {
          const r = await fetch("/api/admin/sync-one", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id }),
          });
          const j = await r.json();
          if (!j.ok) alert(j.error || "Sync failed");
          else alert(j.changed ? "Actualizado" : "Sin cambios");
        } catch (e: any) {
          alert(e?.message || "Error");
        } finally {
          setPending(false);
        }
      }}
    >
      {pending ? "Syncing…" : "Sync now"}
    </button>
  );
}
