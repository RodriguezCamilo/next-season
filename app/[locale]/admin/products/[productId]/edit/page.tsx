import ProductForm from "../../product-form";
import { upsertProduct } from "../../actions";
import { supabaseServerRSC } from "@/lib/supabase/rsc";

export default async function EditProductPage({
  params
}: { params: Promise<{ locale: "es"|"en"; productId: string }> }) {
  const { productId } = await params;
  const sb = await supabaseServerRSC();
  const { data: product } = await sb
    .from("products")
    .select("*")
    .eq("id", productId)
    .single();

  return (
    <div className="max-w-2xl">
      <h1 className="mb-4 text-xl font-semibold">Edit product</h1>
      <ProductForm action={upsertProduct} initial={product ?? undefined} />
    </div>
  );
}
