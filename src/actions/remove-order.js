"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/data/prisma";
import { verifyAdminSession } from "@/utils/session";
import { redirect } from "next/navigation";

export async function removeOrder({ orderId }) {
  await verifyAdminSession();

  try {
    const deletedOrder = await prisma.order.delete({
      where: {
        id: orderId,
      },
    });

    revalidatePath("/dashboard", "page");
    return redirect("/dashboard");
  } catch (error) {
    console.error("Error removing order:", error);
  }
}
