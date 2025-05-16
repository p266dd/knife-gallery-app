import prisma from "@/data/prisma";

import ProductForm from "@/ui/admin/product-form";
import BackButton from "@/ui/back-button";

export default async function AddProductPage({ searchParams }) {
  const handles = await prisma.handle.findMany({ orderBy: { name: "asc" } });
  const filters = await prisma.filter.findMany({ orderBy: { name: "asc" } });
  const brands = await prisma.brand.findMany({ orderBy: { name: "asc" } });
  const materials = await prisma.material.findMany({
    orderBy: { name: "asc" },
  });

  let copy;
  const { starter } = await searchParams;

  if (starter) {
    copy = await prisma.product.findUnique({
      where: {
        id: starter,
      },
      include: {
        sizes: true,
        filters: true,
      },
    });
  }

  return (
    <main className="py-9 px-3">
      <div className="mb-5">
        <BackButton />
      </div>

      <div className="mb-9">
        <h1 className="text-2xl font-semibold text-slate-700">
          Add New Product
        </h1>
      </div>

      <div className="mb-9">
        <ProductForm
          handles={handles && handles}
          filters={filters && filters}
          brands={brands && brands}
          materials={materials && materials}
          copy={copy && copy}
        />
      </div>
    </main>
  );
}
