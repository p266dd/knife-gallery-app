"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/data/prisma";
import { getSession } from "@/utils/session";

export async function removeFavorite(productId) {
  const session = await getSession();

  try {
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

    revalidatePath("/favorites", "page");
    revalidatePath("/products/" + productId, "page");
    revalidatePath("/", "page");

    return deleted;
  } catch (error) {
    console.log(error);
    return null;
  }
}
