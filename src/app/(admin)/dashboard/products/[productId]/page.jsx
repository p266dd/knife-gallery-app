import prisma from "@/data/prisma";
import ProductForm from "@/ui/admin/product-form";

export default async function SingleProductPage({ params }) {
  const { productId } = await params;

  const product = await prisma.product.findUnique({
    where: {
      id: productId,
    },
    include: {
      brand: true,
      sizes: true,
    },
  });

  return (
    <main className="py-7 px-3">
      <div className="mb-9 mt-8">
        <h1 className="text-2xl font-semibold text-slate-700">
          {product.name}
        </h1>
      </div>

      <div className="mb-9">
        <ProductForm product={product} />
      </div>
    </main>
  );
}
