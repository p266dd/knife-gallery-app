"use server";

import prisma from "@/data/prisma";
import { verifyUserSession } from "@/utils/session";

export async function fetchCart(userId = "trdfsgsdfgdsy") {
  const session = await verifyUserSession();

  // * Fetch cart details from dabatase and return cartCount and data.
  const cart = await prisma.cart.findUnique({
    where: {
      clientId: userId,
    },
    include: {
      client: true,
      products: true,
    },
  });

  return {
    cartCount: cart?.length || 0,
    cata: cart || [],
  };
}
