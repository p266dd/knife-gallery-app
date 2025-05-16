"use server";

import prisma from "@/data/prisma";
import { revalidatePath } from "next/cache";

export async function addMessage(message) {
  if (message?.isActive) {
    // * Set isActive to false of all messages.
    await prisma.message.updateMany({
      data: {
        isActive: false,
      },
    });
  }

  // * Add a new message and return it.
  try {
    const newMessage = await prisma.message.create({
      data: {
        title: message.title,
        content: message.content,
        link: message?.link || "",
        isActive: message?.isActive || false,
      },
    });

    revalidatePath("/dashboard/settings");

    return newMessage;
  } catch (err) {
    if (err.code === "P2002") {
      console.log("Item already exists.");
    }
    console.log(err);
  }
}

export async function removeMessage(messageId) {
  const deletedMessage = await prisma.message.delete({
    where: {
      id: messageId,
    },
  });

  revalidatePath("/dashboard/settings");

  return deletedMessage;
}

export async function updateMessage(message) {
  const updatedMessage = await prisma.message.update({
    where: {
      id: message.id,
    },
    data: {
      title: message.title,
      content: message.content,
      link: message?.link || "",
      isActive: message?.isActive || false,
    },
  });

  revalidatePath("/dashboard/settings");

  return updatedMessage;
}
