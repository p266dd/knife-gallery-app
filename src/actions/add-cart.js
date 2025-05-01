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

  console.log(
    sizes.every((s) => Number(s.quantity) === 0 || s.quantity === "")
  );

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
          brand: data.brandOther ? data.brandOther : data.brand,
          handle: data.handle || "No handle.",
          request: data.request,
          details: JSON.stringify(sizes),
        },
      },
    },
  });

  revalidatePath(`/products/${data.productId}`, "page");

  return cart;
}
