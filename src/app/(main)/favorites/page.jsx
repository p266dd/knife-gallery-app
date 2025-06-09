import Image from "next/image";

import { verifyUserSession } from "@/utils/session";
import EmptyFavorites from "@/ui/empty-favorites";
import ProductModal from "@/ui/product-modal";

import { fetchFavorites } from "@/actions/fetch-favorites";

import ImageBlur from "@/assets/image-blur.gif";
import ProductImage from "@/assets/product-image-placeholder.webp";

export default async function FavoritesPage() {
  await verifyUserSession();

  const data = await fetchFavorites();

  return (
    <main className="pt-16 pb-40 sm:pt-24 sm:pb-48">
      <div className="px-6 mt-9 mb-7">
        <h1 className="text-4xl mb-2">Favorites</h1>
        <p className="text-slate-400 sm:text-lg">
          You have {data?.favoritesCount}
          {data?.favoritesCount > 1 ? " items " : " item "}
          in your favorites.
        </p>
      </div>

      <div className="mt-6">
        {data && data?.favoritesCount > 0 ? (
          <div className="px-2 grid grid-cols-3 gap-1 sm:grid-cols-4">
            {data.favorites.products.map((product, i) => {
              return (
                <div key={i} className="relative bg-slate-200">
                  <ProductModal product={product.product}>
                    <Image
                      src={product.product.thumbnail.url || ProductImage}
                      placeholder="blur"
                      blurDataURL={ImageBlur}
                      width={1080}
                      height={1080}
                      alt="Knife image Placeholder"
                      className="w-full h-full object-cover"
                    />
                  </ProductModal>
                </div>
              );
            })}
          </div>
        ) : (
          <EmptyFavorites />
        )}
      </div>
    </main>
  );
}
