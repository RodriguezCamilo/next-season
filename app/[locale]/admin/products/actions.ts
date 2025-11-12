// app/[locale]/admin/products/actions.ts
"use server";

import { revalidateTag, revalidatePath } from "next/cache";
import { supabaseServerRSC } from "@/lib/supabase/rsc";
import { supabaseService } from "@/lib/supabase/supabase";

const ADMIN = "robertobaradel7@gmail.com";

export async function upsertProduct(formData: FormData) {
  const sb = await supabaseServerRSC();
  const {
    data: { user },
  } = await sb.auth.getUser();
  if (!user || user.email?.toLowerCase() !== ADMIN) {
    return { ok: false, error: "Unauthorized" as const };
  }

  const toNull = (v?: string | null) => (v && v.trim() !== "" ? v : null);

  const payload: any = {
    id: formData.get("id")?.toString() || undefined,
    title: formData.get("title")!.toString(),
    slug: formData.get("slug")!.toString(),
    category: formData.get("category")!.toString(),
    description: toNull(formData.get("description")?.toString() || null),
    official_url: toNull(formData.get("official_url")?.toString() || null),
    source_url: toNull(formData.get("source_url")?.toString() || null),
    source_name: toNull(formData.get("source_name")?.toString() || null),
    cover_url: toNull(formData.get("cover_url")?.toString() || null),
    provider: formData.get("provider")?.toString() || "none",
    provider_id: toNull(formData.get("provider_id")?.toString() || null),
    auto_enabled: formData.get("auto_enabled")?.toString() === "on",
    manual_release_at: toNull(
      formData.get("manual_release_at")?.toString() || null
    ),
    manual_status: formData.get("manual_status")?.toString() || null,
    manual_source_name: toNull(
      formData.get("manual_source_name")?.toString() || null
    ),
    manual_source_url: toNull(
      formData.get("manual_source_url")?.toString() || null
    ),
  };

  // upsert product
  let productId = payload.id as string | undefined;
  if (productId) {
    const { error } = await sb
      .from("products")
      .update(payload)
      .eq("id", productId);
    if (error) return { ok: false, error: error.message as string };
  } else {
    const { data, error } = await sb
      .from("products")
      .insert(payload)
      .select("id")
      .single();
    if (error) return { ok: false, error: error.message as string };
    productId = data?.id as string;
  }

  // si hay overrides manuales, aseguramos una "próxima season"
  if (productId && payload.manual_release_at) {
    const svc = supabaseService();

    // buscamos próxima season (futura o null)
    const { data: seasons } = await svc
      .from("seasons")
      .select("*")
      .eq("product_id", productId)
      .order("release_at", { ascending: true, nullsFirst: true });

    const next =
      seasons?.find(
        (s) => !s.release_at || new Date(s.release_at) > new Date()
      ) ?? null;

    const seasonPayload = {
      label: "Next season",
      release_at: payload.manual_release_at,
      status: (payload.manual_status || "confirmed") as
        | "confirmed"
        | "estimated"
        | "delayed",
      source_name: payload.manual_source_name,
      source_url: payload.manual_source_url,
      cover_url: payload.cover_url ?? null,
    };

    if (next) {
      await svc.from("seasons").update(seasonPayload).eq("id", next.id);
    } else {
      await svc.from("seasons").insert({
        product_id: productId,
        slug: createSeasonSlug(seasonPayload.label),
        ...seasonPayload,
      });
    }
  }

  revalidateTag("upcoming", "default");
  revalidatePath("/es");
  revalidatePath("/en");
  return { ok: true as const };
}

function createSeasonSlug(label: string) {
  return label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function deleteProduct(id: string) {
  const sb = await supabaseServerRSC();
  const {
    data: { user },
  } = await sb.auth.getUser();
  if (!user || user.email?.toLowerCase() !== ADMIN)
    return { ok: false, error: "Unauthorized" };

  const { error } = await sb.from("products").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };

  revalidateTag("upcoming", "default");
  revalidatePath("/es", "page");
  revalidatePath("/en", "page");
  return { ok: true };
}
