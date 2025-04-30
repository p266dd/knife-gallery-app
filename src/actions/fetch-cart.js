"use server";

import prisma from "@/data/prisma";
import { verifyUserSession } from "@/utils/session";

export async function fetchCart() {
  const session = await verifyUserSession();

  // * Fetch cart details from dabatase and return cartCount and data.
  const cart = await prisma.cart.findUnique({
    where: {
      clientId: session.id,
    },
    include: {
      client: true,
      products: {
        include: {
          product: {
            include: {
              thumbnail: true,
              media: true,
              sizes: true,
            },
          },
        },
      },
    },
  });

  return {
    cartCount: cart.products?.length || 0,
    data: cart || [],
  };
}
