import prisma from "@/data/prisma";
import ProductForm from "@/ui/admin/product-form";
import BackButton from "@/ui/back-button";

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
  const handles = await prisma.handle.findMany({ orderBy: { name: "asc" } });
  const filters = await prisma.filter.findMany({ orderBy: { name: "asc" } });
  const brands = await prisma.brand.findMany({ orderBy: { name: "asc" } });
  const materials = await prisma.material.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <main className="py-9 px-3">
      <div className="mb-5">
        <BackButton />
      </div>

      <div className="mb-9">
        <span className="text-sm text-slate-500">Editing</span>
        <h1 className="text-2xl font-semibold text-slate-700">
          {product.name}
        </h1>
      </div>

      <div className="mb-9">
        <ProductForm
          product={product}
          handles={(handles && handles) || []}
          filters={(filters && filters) || []}
          brands={(brands && brands) || []}
          materials={(materials && materials) || []}
          edit={true}
        />
      </div>
    </main>
  );
}
