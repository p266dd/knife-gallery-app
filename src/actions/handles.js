"use server";

import prisma from "@/data/prisma";
import { revalidatePath } from "next/cache";

// Helper to extract handle data from FormData
function getHandleDataFromFormData(formData) {
  return {
    name: formData.get("handleName").trim(),
  };
}

export async function fetchHandles() {
  // * return handles.
  const handles = await prisma.handle.findMany({
    select: {
      id: true,
      name: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  return handles;
}

export async function addHandleAction(previousState, formData) {
  const handleData = getHandleDataFromFormData(formData);

  if (!handleData.name) {
    return { success: false, error: "Handle name is required." };
  }

  try {
    const newHandle = await prisma.handle.create({
      data: {
        name: handleData.name,
      },
    });

    revalidatePath("/dashboard/settings");
    return {
      success: true,
      message: "Handle added successfully.",
      data: newHandle,
    };
  } catch (err) {
    // console.error("addHandleAction Error:", err);
    if (err.code === "P2002") {
      return {
        success: false,
        error: "A handle with this name already exists.",
      };
    }
    return { success: false, error: "Failed to add handle." };
  }
}

export async function removeHandleAction(handleId) {
  if (!handleId) {
    return { success: false, error: "Handle ID is required for removal." };
  }
  try {
    const deletedHandle = await prisma.handle.delete({
      where: {
        id: Number(handleId), // Ensure ID is a number
      },
    });

    revalidatePath("/dashboard/settings");
    return {
      success: true,
      message: "Handle removed successfully.",
      data: deletedHandle,
    };
  } catch (err) {
    console.error("removeHandleAction Error:", err);
    if (err.code === "P2025") {
      // Record to delete not found
      return { success: false, error: "Handle not found." };
    }
    return { success: false, error: "Failed to remove handle." };
  }
}

export async function updateHandleAction(previousState, formData) {
  const handleData = getHandleDataFromFormData(formData);
  const handleId = formData.get("handleId");

  if (!handleId) {
    return { success: false, error: "Handle ID is missing for update." };
  }
  if (!handleData.name) {
    return { success: false, error: "Handle name is required." };
  }

  try {
    const updatedHandle = await prisma.handle.update({
      where: { id: Number(handleId) }, // Ensure ID is a number
      data: { name: handleData.name },
    });

    revalidatePath("/dashboard/settings");
    return {
      success: true,
      message: "Handle updated successfully.",
      data: updatedHandle,
    };
  } catch (err) {
    console.error("updateHandleAction Error:", err);
    if (err.code === "P2025") {
      // Record to update not found
      return { success: false, error: "Handle not found." };
    } else if (err.code === "P2002") {
      return {
        success: false,
        error: "A handle with this name already exists.",
      };
    }
    return { success: false, error: "Failed to update handle." };
  }
}
