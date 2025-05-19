import prisma from "@/data/prisma";
import { getSession } from "@/utils/session";

import AddToFavortite from "@/ui/add-to-favorite";
import ProductGallery from "@/ui/product-gallery";
import ProductForm from "@/ui/product-form";

export default async function ProductSinglePage({ params }) {
  const getParams = await params;
  const session = await getSession();

  const product = await prisma.product.findUnique({
    where: {
      id: getParams.productId,
    },
    include: {
      media: true,
      thumbnail: true,
      sizes: true,
      filters: true,
    },
  });

  const user = await prisma.user.findUnique({
    where: {
      id: session.id,
    },
    select: {
      engraving: true,
      id: true,
    },
  });

  const userPreferences = {
    engraving: user.engraving ? JSON.parse(user.engraving) : [],
    id: user.id,
  };

  const cart = await prisma.cart.findUnique({
    where: {
      clientId: user.id,
    },
    select: {
      products: {
        include: {
          product: true,
        },
      },
    },
  });

  return (
    <main className="pt-16 pb-40">
      <div className="px-6 mt-9 mb-9 sm:mb-16">
        <h1 className="text-3xl mb-2 capitalize sm:text-4xl">{product.name}</h1>
        <p className="text-xs text-slate-400 sm:text-sm">
          Product ID: {product.id}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-start gap-16">
        <div className="relative flex-grow mx-3 mb-9 sm:w-1/2">
          <AddToFavortite productId={product.id} />
          <ProductGallery product={product} />
        </div>

        <div className="px-6 flex-grow sm:w-1/2">
          <div className="mb-6">
            <p className="text-slate-600 whitespace-pre-line">
              {product.description}
            </p>
          </div>
          <ProductForm
            product={product}
            preferences={userPreferences}
            cart={cart}
          />
        </div>
      </div>
    </main>
  );
}
