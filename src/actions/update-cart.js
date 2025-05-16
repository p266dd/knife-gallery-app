"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/data/prisma";
import { verifyUserSession } from "@/utils/session";

export async function updateCart(state, formData) {
  await verifyUserSession();
  const data = Object.fromEntries(formData);

  let sizes = [];
  // * Extract and format the sizes into [{sizeId: value},...]
  Object.entries(data).map(([key, val]) => {
    if (key.split("_")[0] === "size") {
      const sizeId = key.split("_")[1];
      sizes.push({ id: sizeId, quantity: val });
    }
  });

  // * Update specific product in cart collection.
  const updatedCart = await prisma.cartProduct.update({
    where: {
      id: Number(data.productCartId),
    },
    data: {
      brand: data.brandOther ? data.brandOther : data.brand,
      handle: data.handle,
      request: data.request,
      details: JSON.stringify(sizes),
    },
  });

  revalidatePath(`/products/${data.productId}`, "page");
  revalidatePath("/cart", "page");

  return {
    message: "Product updated.",
    status: "success",
  };
}
