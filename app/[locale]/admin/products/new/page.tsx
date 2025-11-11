import ProductForm from "../product-form";
import { upsertProduct } from "../actions";

export default function NewProductPage() {
  return (
    <div className="max-w-2xl">
      <h1 className="mb-4 text-xl font-semibold">New product</h1>
      <ProductForm action={upsertProduct} />
    </div>
  );
}
