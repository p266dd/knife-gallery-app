"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/data/prisma";
import { verifyUserSession } from "@/utils/session";

export async function removeCart({ cartProductId, productId }) {
  const session = await verifyUserSession();

  const removedCart = await prisma.cartProduct.delete({
    where: {
      id: Number(cartProductId),
    },
  });

  revalidatePath(`/products/${productId}`, "page");
  revalidatePath("/cart", "page");

  return removedCart;
}

export async function clearCart() {
  const session = await verifyUserSession();

  const clearedCart = await prisma.cart.update({
    where: {
      clientId: session.id,
    },
    data: {
      products: {
        deleteMany: {},
      },
    },
  });

  revalidatePath("/cart", "page");

  return clearedCart;
}
