import prisma from "@/data/prisma";
import { getSession } from "@/utils/session";
import EmptyFavorites from "@/ui/empty-favorites";
import ProductModal from "@/ui/product-modal";

import { fetchFavorites } from "@/actions/fetch-favorites";

export default async function FavoritesPage() {
  const session = await getSession();

  const data = await fetchFavorites();

  return (
    <main className="pt-16 pb-36">
      <div className="px-6 mt-9 mb-7">
        <h1 className="text-4xl mb-2">Favorites</h1>
        <p className="text-sm text-slate-400">
          You have {data.favoritesCount}{" "}
          {data.favoritesCount >= 1 ? "items " : "item "}
          in your favorites.
        </p>
      </div>

      <div className="mt-6">
        {data && data.favorites.length > 0 ? (
          <ProductModal products={data.favorites} />
        ) : (
          <EmptyFavorites />
        )}
      </div>
    </main>
  );
}
