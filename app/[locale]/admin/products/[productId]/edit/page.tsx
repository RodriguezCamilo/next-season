import ProductFormServer from "../../product-form";
import { supabaseServerRSC } from "@/lib/supabase/rsc";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ locale: "es" | "en"; productId: string }>;
}) {
  const { locale, productId } = await params;
  const sb = await supabaseServerRSC();
  const { data: product } = await sb
    .from("products")
    .select("*")
    .eq("id", productId)
    .single();

  return (
    <div className=" flex flex-1 flex-col items-center">
      <h1 className="mb-4 text-xl font-semibold">Edit product</h1>
      <ProductFormServer initial={product ?? undefined} locale={locale} />
    </div>
  );
}
