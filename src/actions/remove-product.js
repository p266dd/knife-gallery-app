"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/data/prisma";
import { verifyAdminSession } from "@/utils/session";
import { redirect } from "next/navigation";

export async function removeProduct(productId) {
  await verifyAdminSession();

  try {
    const deletedProduct = await prisma.product.delete({
      where: {
        id: productId,
      },
    });

    revalidatePath("/dashboard/products", "page");
    return redirect("/dashboard/products", "push");
  } catch (error) {
    console.error("Error removing product:", error);
  }
}
