// app/[locale]/admin/products/actions.ts
"use server";

import { revalidateTag, revalidatePath } from "next/cache";
import { supabaseServerRSC } from "@/lib/supabase/rsc";

type ActionResult = { ok: true } | { ok: false; error: string };

type Category = "game" | "show" | "anime" | "esport";

export async function upsertProduct(formData: FormData): Promise<ActionResult> {
  const sb = await supabaseServerRSC();

  const { data: { user } } = await sb.auth.getUser();
  if (!user || user.email?.toLowerCase() !== "robertobaradel7@gmail.com") {
    return { ok: false, error: "Unauthorized" };
  }

  // Parseo básico
  const id = formData.get("id")?.toString() || undefined;
  const title = formData.get("title")?.toString() ?? "";
  const slug = formData.get("slug")?.toString() ?? "";
  const category = formData.get("category")?.toString() as Category | undefined;

  if (!title || !slug || !category) {
    return { ok: false, error: "Missing required fields" };
  }

  const payload = {
    title,
    slug,
    category,
    description: formData.get("description")?.toString() || null,
    official_url: formData.get("official_url")?.toString() || null,
    source_url: formData.get("source_url")?.toString() || null,
    source_name: formData.get("source_name")?.toString() || null,
    cover_url: formData.get("cover_url")?.toString() || null
  };

  if (id) {
    const { error } = await sb.from("products").update(payload).eq("id", id);
    if (error) return { ok: false, error: error.message };
  } else {
    const { error } = await sb.from("products").insert(payload);
    if (error) return { ok: false, error: error.message };
  }

  // Next 16: requiere 2do argumento
  revalidateTag("upcoming", "default");
  revalidatePath("/es", "page");
  revalidatePath("/en", "page");

  return { ok: true };
}
