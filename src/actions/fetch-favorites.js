"use server";

import prisma from "@/data/prisma";
import { verifyUserSession } from "@/utils/session";

export async function fetchFavorites() {
  const session = await verifyUserSession();

  // * Fetch cart details from dabatase and return cartCount and data.
  const favorites = await prisma.favorite.findUnique({
    where: {
      clientId: session.id,
    },
    include: {
      client: true,
      products: true,
    },
  });

  return {
    favoritesCount: favorites?.length || 0,
    favorites: favorites || [],
  };
}
