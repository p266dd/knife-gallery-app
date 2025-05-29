"use server";

import prisma from "@/data/prisma";
import { verifyAdminSession } from "@/utils/session";
import { revalidatePath } from "next/cache";

export async function updateOrder({ orderId, status }) {
  await verifyAdminSession();

  try {
    const updatedOrder = await prisma.order.update({
      where: {
        id: orderId,
      },
      data: {
        updatedAt: new Date(),
        completedAt: status === "completed" ? new Date() : null,
        isCompleted: status === "completed",
      },
    });

    revalidatePath("/orders");
    revalidatePath("/orders/" + orderId);

    return { success: true, order: updatedOrder };
  } catch (error) {
    console.error("Error updating order:", error);
    return { success: false, error: error.message };
  }
}
