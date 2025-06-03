"use server";

import prisma from "@/data/prisma";
import { revalidatePath } from "next/cache";

// Helper to extract message data from FormData
function getMessageDataFromFormData(formData) {
  return {
    title: formData.get("messageTitle"),
    content: formData.get("messageContent"),
    link: formData.get("messageLink") || "",
    // formData.get('isActive') returns 'on' if checked, null otherwise.
    isActive: formData.get("isActive") === "on",
  };
}

export async function addMessageAction(previousState, formData) {
  const messageData = getMessageDataFromFormData(formData);

  if (!messageData.title || !messageData.content) {
    return { success: false, error: "Title and content are required." };
  }

  try {
    if (messageData.isActive) {
      // Set isActive to false for all other messages.
      await prisma.message.updateMany({
        data: { isActive: false },
      });
    }

    const newMessage = await prisma.message.create({
      data: {
        title: messageData.title,
        content: messageData.content,
        link: messageData.link,
        isActive: messageData.isActive,
      },
    });

    revalidatePath("/dashboard/settings");
    return {
      success: true,
      message: "Message added successfully.",
      data: newMessage,
    };
  } catch (err) {
    console.error("addMessageAction Error:", err);
    if (err.code === "P2002") {
      // Assuming title is unique or some other unique constraint caused this
      return {
        success: false,
        error: "A message with this title already exists.",
      };
    }
    return { success: false, error: "Failed to add message." };
  }
}

export async function removeMessage(messageId) {
  if (!messageId) {
    return { success: false, error: "Message ID is required for removal." };
  }
  try {
    const deletedMessage = await prisma.message.delete({
      where: { id: Number(messageId) },
    });
    revalidatePath("/dashboard/settings");
    return {
      success: true,
      message: "Message removed successfully.",
      data: deletedMessage,
    };
  } catch (err) {
    console.error("removeMessage Error:", err);
    if (err.code === "P2025") {
      // Record to delete not found
      return { success: false, error: "Message not found." };
    }
    return { success: false, error: "Failed to remove message." };
  }
}

export async function updateMessageAction(previousState, formData) {
  const messageData = getMessageDataFromFormData(formData);
  const messageId = formData.get("messageId");

  if (!messageId) {
    return { success: false, error: "Message ID is missing for update." };
  }
  if (!messageData.title || !messageData.content) {
    return { success: false, error: "Title and content are required." };
  }

  try {
    if (messageData.isActive) {
      // Deactivate all other messages first
      await prisma.message.updateMany({
        where: { NOT: { id: Number(messageId) } },
        data: { isActive: false },
      });
    }

    const updatedMessage = await prisma.message.update({
      where: { id: Number(messageId) },
      data: messageData, // messageData already has the correct structure
    });

    revalidatePath("/dashboard/settings");
    return {
      success: true,
      message: "Message updated successfully.",
      data: updatedMessage,
    };
  } catch (err) {
    console.error("updateMessageAction Error:", err);
    if (err.code === "P2025") {
      // Record to update not found
      return { success: false, error: "Message not found." };
    }
    return { success: false, error: "Failed to update message." };
  }
}
