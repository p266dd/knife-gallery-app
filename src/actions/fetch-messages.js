"use server";
import prisma from "@/data/prisma";
import { verifyAdminSession } from "@/utils/session";
import { verifyUserSession } from "@/utils/session";

export async function fetchMessages() {
  await verifyAdminSession();

  try {
    const messages = prisma.message.findMany();
    return messages;
  } catch (error) {
    console.log(error);
  }
}

export async function fetchActiveMessage() {
  await verifyUserSession();

  try {
    const message = await prisma.message.findFirst({
      where: {
        isActive: true,
      },
    });
    return message;
  } catch (error) {
    console.log(error);
  }
}
