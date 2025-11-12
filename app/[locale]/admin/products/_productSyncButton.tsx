"use client";

import { useState } from "react";

export default function _ProductSyncButton({ id }: { id: string }) {
  const [syncing, setSyncing] = useState(false);

  async function handleSyncNow() {
    setSyncing(true);
    try {
      const r = await fetch("/api/admin/sync-one", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id })
      });
      const j = await r.json();
      if (!j.ok) alert(j.error || "Sync failed");
      else alert(j.changed ? "Actualizado" : "Sin cambios");
    } catch (e: any) {
      alert(e?.message || "Error");
    } finally {
      setSyncing(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleSyncNow}
      disabled={syncing}
      className="rounded border px-3 py-2 text-sm hover:bg-accent/10 disabled:opacity-60"
    >
      {syncing ? "Syncing…" : "Sync now"}
    </button>
  );
}
