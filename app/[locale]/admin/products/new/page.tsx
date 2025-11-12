import ProductFormServer from "../product-form";

export default async function NewProductPage({
  params,
}: {
  params: Promise<{ locale: "es" | "en" }>;
}) {
  const { locale } = await params;
  return (
    <div className=" flex flex-1 flex-col items-center">
      <h1 className="mb-4 text-xl font-semibold">New product</h1>
      <ProductFormServer locale={locale} />
    </div>
  );
}
