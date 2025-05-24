"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/data/prisma";
import { verifyUserSession } from "@/utils/session";

export async function removeCart({ cartProductId, productId }) {
  const session = await verifyUserSession();

  try {
    const removedCart = await prisma.cartProduct.delete({
      where: {
        id: Number(cartProductId),
      },
    });

    revalidatePath(`/products/${productId}`, "page");
    revalidatePath("/cart", "page");

    return removedCart;
  } catch (error) {
    console.log(error);
  }
}

export async function clearCart() {
  const session = await verifyUserSession();

  try {
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
  } catch (error) {
    console.log(error);
  }
}
