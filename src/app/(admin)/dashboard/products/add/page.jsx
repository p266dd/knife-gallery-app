import ProductForm from "@/ui/admin/product-form";

export default async function AddProductPage({ params }) {
  return (
    <main className="py-7 px-3">
      <div className="mb-9 mt-8">
        <h1 className="text-2xl font-semibold text-slate-700">
          Add New Product
        </h1>
      </div>

      <div className="mb-9">
        <ProductForm />
      </div>
    </main>
  );
}
