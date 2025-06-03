"use server";

import prisma from "@/data/prisma";
import { revalidatePath } from "next/cache";

// Helper to extract material data from FormData
function getMaterialDataFromFormData(formData) {
  return {
    name: formData.get("materialName")?.trim(),
  };
}

export async function fetchMaterials() {
  // * return materials.
  const materials = await prisma.material.findMany({
    select: {
      id: true,
      name: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  return materials;
}

export async function addMaterialAction(previousState, formData) {
  const materialData = getMaterialDataFromFormData(formData);

  if (!materialData.name) {
    return { success: false, error: "Material name is required." };
  }

  try {
    const newMaterial = await prisma.material.create({
      data: {
        name: materialData.name,
      },
    });

    revalidatePath("/dashboard/settings");
    return {
      success: true,
      message: "Material added successfully.",
      data: newMaterial,
    };
  } catch (err) {
    console.error("addMaterialAction Error:", err);
    if (err.code === "P2002") {
      return {
        success: false,
        error: "A material with this name already exists.",
      };
    }
    return { success: false, error: "Failed to add material." };
  }
}

export async function removeMaterialAction(materialId) {
  if (!materialId) {
    return { success: false, error: "Material ID is required for removal." };
  }
  try {
    const deletedMaterial = await prisma.material.delete({
      where: {
        id: Number(materialId), // Ensure ID is a number
      },
    });

    revalidatePath("/dashboard/settings");
    return {
      success: true,
      message: "Material removed successfully.",
      data: deletedMaterial,
    };
  } catch (err) {
    console.error("removeMaterialAction Error:", err);
    if (err.code === "P2025") {
      // Record to delete not found
      return { success: false, error: "Material not found." };
    }
    return { success: false, error: "Failed to remove material." };
  }
}

export async function updateMaterialAction(previousState, formData) {
  const materialData = getMaterialDataFromFormData(formData);
  const materialId = formData.get("materialId");

  if (!materialId) {
    return { success: false, error: "Material ID is missing for update." };
  }
  if (!materialData.name) {
    return { success: false, error: "Material name is required." };
  }

  try {
    const updatedMaterial = await prisma.material.update({
      where: { id: Number(materialId) }, // Ensure ID is a number
      data: { name: materialData.name },
    });

    revalidatePath("/dashboard/settings");
    return {
      success: true,
      message: "Material updated successfully.",
      data: updatedMaterial,
    };
  } catch (err) {
    console.error("updateMaterialAction Error:", err);
    if (err.code === "P2025") {
      // Record to update not found
      return { success: false, error: "Material not found." };
    } else if (err.code === "P2002") {
      return {
        success: false,
        error: "A material with this name already exists.",
      };
    }
    return { success: false, error: "Failed to update material." };
  }
}
