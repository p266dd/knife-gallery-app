"use server";

import prisma from "@/data/prisma";
import { getSession } from "@/utils/session";

export async function removeFavorite(productId) {
  const session = await getSession();

  const favorite = await prisma.favorite.findUnique({
    where: {
      clientId: session.id,
    },
  });

  const deleted = await prisma.favorite.update({
    where: {
      clientId: session.id,
    },
    data: {
      products: {
        delete: {
          favoriteId_productId: {
            favoriteId: favorite.id,
            productId: productId,
          },
        },
      },
    },
  });

  return deleted;
}
