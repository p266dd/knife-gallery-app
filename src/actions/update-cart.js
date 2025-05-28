"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/data/prisma";
import { verifyUserSession } from "@/utils/session";

export async function updateCart(state, formData) {
  await verifyUserSession();
  const newState = { ...state, data: Object.fromEntries(formData) };

  let sizes = [];
  // * Extract and format the sizes into [{sizeId: value},...]
  Object.entries(newState.data).map(([key, val]) => {
    if (key.split("_")[0] === "size") {
      const sizeId = key.split("_")[1];
      sizes.push({ id: sizeId, quantity: val });
    }
  }); // * Check if all quantities are zero.
  const allQuantitiesZero = sizes.every((size) => Number(size.quantity) === 0);

  if (allQuantitiesZero) {
    try {
      // * Delete the cart product if all quantities are zero.
      await prisma.cartProduct.delete({
        where: {
          id: Number(newState.data.productCartId),
        },
      });

      revalidatePath(`/products/${newState.data.productId}`, "page");
      revalidatePath("/cart", "page");

      return { ...newState, message: "Product removed from cart." };
    } catch (error) {
      console.log(error);
      return {
        ...state,
        generalError: "Could not remove product. Try refreshing page.",
      };
    }
  }

  try {
    // * Update specific product in cart collection.
    const updatedCart = await prisma.cartProduct.update({
      where: {
        id: Number(newState.data.productCartId),
      },
      data: {
        brand: newState.data.brandOther
          ? newState.data.brandOther
          : newState.data.brand,
        handle: newState.data.handleOther
          ? newState.data.handleOther
          : newState.data.handle,
        request: newState.data.request,
        details: JSON.stringify(sizes),
      },
    });

    revalidatePath(`/products/${newState.data.productId}`, "page");
    revalidatePath("/cart", "page");

    return { ...newState, message: "Product updated successfully." };
  } catch (error) {
    console.log(error);
    return { ...state, generalError: "Could not update. Try refreshing page." };
  }
}
