"use server";

import prisma from "@/data/prisma";
import { verifyUserSession } from "@/utils/session";

export async function fetchFavorites() {
  const session = await verifyUserSession();

  try {
    // * Fetch current user cart, return cartCount and data.
    const favorites = await prisma.favorite.findUnique({
      where: {
        clientId: session.id,
      },
      include: {
        products: {
          include: {
            product: {
              select: {
                id: true,
                thumbnail: true,
                media: true,
                name: true,
              },
            },
          },
        },
      },
    });

    return {
      favoritesCount: favorites?.products?.length || 0,
      favorites: favorites,
    };
  } catch (error) {
    console.log(error);
    return null;
  }
}
