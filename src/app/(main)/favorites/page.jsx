import Image from "next/image";

import { verifyUserSession } from "@/utils/session";
import EmptyFavorites from "@/ui/empty-favorites";
import ProductModal from "@/ui/product-modal";

import { fetchFavorites } from "@/actions/fetch-favorites";

export default async function FavoritesPage() {
  await verifyUserSession();

  const data = await fetchFavorites();

  return (
    <main className="pt-16 pb-40">
      <div className="px-6 mt-9 mb-7">
        <h1 className="text-4xl mb-2">Favorites</h1>
        <p className="text-sm text-slate-400">
          You have {data.favoritesCount}{" "}
          {data.favoritesCount > 1 ? "items " : "item "}
          in your favorites.
        </p>
      </div>

      <div className="mt-6">
        <div className="px-2 grid grid-cols-3 gap-1">
          {data && data.favoritesCount > 0 ? (
            data.favorites.products.map((product, i) => {
              return (
                <div key={i} className="relative bg-slate-100">
                  <ProductModal product={product.product}>
                    <Image
                      src={
                        product.product.thumbnail.url || "/product-image.webp"
                      }
                      width={1080}
                      height={1080}
                      alt="Placeholder"
                      className="w-full h-full object-cover"
                    />
                  </ProductModal>
                </div>
              );
            })
          ) : (
            <EmptyFavorites />
          )}
        </div>
      </div>
    </main>
  );
}
