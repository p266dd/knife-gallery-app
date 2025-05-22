"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/data/prisma";
import { verifyUserSession } from "@/utils/session";

export async function addToCart(state, formData) {
  const session = await verifyUserSession();
  const data = Object.fromEntries(formData);

  state.generalError = "";
  state.message = "";

  let sizes = [];
  // * Extract and format the sizes into [{sizeId: value},...]
  Object.entries(data).map(([key, val]) => {
    if (key.split("_")[0] === "size") {
      const sizeId = key.split("_")[1];
      sizes.push({ id: sizeId, quantity: val });
    }
  });

  if (sizes.every((s) => Number(s.quantity) === 0 || s.quantity === "")) {
    return { ...state, generalError: "You have to add quantity to a product." };
  }

  // * verify if the user already has a collection.
  let collection = await prisma.cart.findUnique({
    where: {
      clientId: session.id,
    },
  });

  // * Create collection if it doesn't exist.
  if (!collection) {
    collection = await prisma.cart.create({
      data: {
        client: {
          connect: {
            id: session.id,
          },
        },
      },
    });
  }

  // * Retrieve the products brand and handle to add
  // in case the client didn't add.
  const productDetails = await prisma.product.findUnique({
    where: {
      id: data.productId,
    },
    select: {
      brand: true,
      handle: true,
    },
  });

  // * Add item to cart collection.
  const cart = await prisma.cart.update({
    where: {
      clientId: session.id,
    },
    data: {
      products: {
        create: {
          product: {
            connect: {
              id: data.productId,
            },
          },
          brand:
            (data.brandOther ? data.brandOther : data.brand) ||
            productDetails.brand,
          handle:
            (data.handleOther ? data.handleOther : data.handle) ||
            productDetails.handle,
          request: data.request,
          details: JSON.stringify(sizes),
        },
      },
    },
  });

  revalidatePath(`/products/${data.productId}`, "page");

  return cart;
}
