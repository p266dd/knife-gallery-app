"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/data/prisma";
import { verifyUserSession } from "@/utils/session";

export async function addFavorite(productId) {
  const session = await verifyUserSession();

  try {
    // * verify if the user already has a collection.
    let collection = await prisma.favorite.findUnique({
      where: {
        clientId: session.id,
      },
    });

    // * Create collection if it doesn't exist.
    if (!collection) {
      collection = await prisma.favorite.create({
        data: {
          client: {
            connect: {
              id: session.id,
            },
          },
        },
      });
    }

    // * Add item to collection.
    const favorite = await prisma.favorite.update({
      where: {
        clientId: session.id,
      },
      data: {
        products: {
          create: {
            product: {
              connect: {
                id: productId,
              },
            },
          },
        },
      },
    });

    revalidatePath("/favorites", "page");
    revalidatePath("/products/" + productId, "page");
    revalidatePath("/", "page");

    return favorite;
  } catch (error) {
    console.log(error);
    return null;
  }
}
