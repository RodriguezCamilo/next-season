"use client";

import { useFormStatus } from "react-dom";

export default function DeleteConfirmButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      className="rounded border px-2 py-1 hover:bg-destructive/20 disabled:opacity-50"
      disabled={pending}
      onClick={(e) => {
        if (!confirm("Delete product?")) {
          e.preventDefault(); // cancela el submit si no confirma
        }
      }}
    >
      {pending ? "Deleting…" : "Delete"}
    </button>
  );
}
