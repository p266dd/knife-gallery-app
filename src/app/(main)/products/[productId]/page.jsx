import { string } from "yup";
import { redirect } from "next/navigation";
import prisma from "@/data/prisma";
import { getSession } from "@/utils/session";

import AddToFavortite from "@/ui/add-to-favorite";
import ProductGallery from "@/ui/product-gallery";
import ProductForm from "@/ui/product-form";

export default async function ProductSinglePage({ params }) {
  const getParams = await params;
  const session = await getSession();

  // * Clean productId.
  const sanitizedProductId = await string()
    .default("")
    .min(1, "Product ID is required")
    .trim()
    .validate(getParams.productId);

  const productPromise = prisma.product.findUnique({
    where: {
      id: sanitizedProductId,
    },
    include: {
      media: true,
      thumbnail: true,
      sizes: true,
      filters: true,
    },
  });

  let userPromise;
  if (session?.id) {
    userPromise = await prisma.user.findUnique({
      where: {
        id: session.id,
      },
      select: {
        engraving: true,
        id: true,
      },
    });
  } else {
    userPromise = Promise.resolve(null);
  }

  const [product, user] = await Promise.all([productPromise, userPromise]);

  if (!product) {
    return redirect("/");
  }

  // Initialize userPreferences and cart with defaults.
  let userPreferences = { engraving: [], id: null };
  let cart = null;

  if (user) {
    // User exists, attempt to parse engraving and fetch cart
    try {
      userPreferences.engraving = user.engraving ? JSON.parse(user.engraving) : [];
    } catch (error) {
      console.error("Failed to parse user engraving data for user:", user.id, error);
      // Engraving remains default empty array
    }
    userPreferences.id = user.id;

    cart = await prisma.cart.findUnique({
      where: { clientId: user.id },
      select: { products: { include: { product: true } } },
    });
  }

  return (
    <main className="pt-16 pb-40">
      <div className="px-6 mt-9 mb-9 sm:mb-16">
        <h1 className="text-3xl mb-2 capitalize sm:text-4xl">{product.name}</h1>
        <p className="text-xs text-slate-400 sm:text-sm">Product ID: {product.id}</p>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-start gap-9">
        <div className="relative flex-grow mx-3 mb-9 sm:w-1/2">
          <AddToFavortite productId={product.id} />
          <ProductGallery product={product} />
        </div>

        <div className="px-6 flex-grow sm:w-1/2">
          {product?.description && (
            <div className="mb-6">
              <p className="text-slate-600 whitespace-pre-line">{product?.description}</p>
            </div>
          )}

          <ProductForm product={product} preferences={userPreferences} cart={cart} />
        </div>
      </div>
    </main>
  );
}
