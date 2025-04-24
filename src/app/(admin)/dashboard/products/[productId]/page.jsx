import prisma from "@/data/prisma";
import ProductForm from "@/ui/admin/product-form";

export default async function SingleProductPage({ params }) {
  const { productId } = await params;

  const product = await prisma.product.findUnique({
    where: {
      id: productId,
    },
    include: {
      media: true,
      thumbnail: true,
      sizes: true,
      filters: true,
    },
  });

  return (
    <main className="py-7 px-3">
      <div className="mb-9 mt-8">
        <span className="text-sm text-slate-500">Editing</span>
        <h1 className="text-2xl font-semibold text-slate-700">
          {product.name}
        </h1>
      </div>

      <div className="mb-9">
        <ProductForm product={product} edit={true} />
      </div>
    </main>
  );
}
