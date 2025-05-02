"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/data/prisma";
import { verifyAdminSession } from "@/utils/session";
import { redirect } from "next/navigation";

export async function removeUser(userId) {
  await verifyAdminSession();

  await prisma.user.delete({
    where: {
      id: userId,
    },
  });

  revalidatePath("/dashboard/users", "page");

  return redirect("/dashboard/users");
}
