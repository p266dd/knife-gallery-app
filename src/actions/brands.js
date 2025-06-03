"use server";

import prisma from "@/data/prisma";
import { revalidatePath } from "next/cache";

// Helper to extract brand data from FormData
function getBrandDataFromFormData(formData) {
  return {
    name: formData.get("brandName").trim(),
  };
}

export async function fetchBrands() {
  // * return brands.
  const brands = await prisma.brand.findMany({
    select: {
      id: true,
      name: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  return brands;
}

export async function addBrandAction(previousState, formData) {
  console.log("Add Action.");
  const brandData = getBrandDataFromFormData(formData);

  if (!brandData.name) {
    return { success: false, error: "Brand name is required." };
  }

  try {
    const newBrand = await prisma.brand.create({
      data: {
        name: brandData.name,
      },
    });

    revalidatePath("/dashboard/settings");
    return {
      success: true,
      message: "Brand added successfully.",
      data: newBrand,
    };
  } catch (err) {
    // console.error("addBrandAction Error:", err);
    if (err.code === "P2002") {
      return {
        success: false,
        error: "A brand with this name already exists.",
      };
    }
    return { success: false, error: "Failed to add brand." };
  }
}

export async function removeBrandAction(brandId) {
  // Keep existing signature for direct calls
  if (!brandId) {
    return { success: false, error: "Brand ID is required for removal." };
  }
  try {
    const deletedBrand = await prisma.brand.delete({
      where: {
        id: Number(brandId), // Ensure ID is a number
      },
    });

    revalidatePath("/dashboard/settings");
    return {
      success: true,
      message: "Brand removed successfully.",
      data: deletedBrand,
    };
  } catch (err) {
    console.error("removeBrandAction Error:", err);
    if (err.code === "P2025") {
      // Record to delete not found
      return { success: false, error: "Brand not found." };
    }
    return { success: false, error: "Failed to remove brand." };
  }
}

export async function updateBrandAction(previousState, formData) {
  console.log("Update Action.");
  const brandData = getBrandDataFromFormData(formData);
  const brandId = formData.get("brandId");

  if (!brandId) {
    return { success: false, error: "Brand ID is missing for update." };
  }
  if (!brandData.name) {
    return { success: false, error: "Brand name is required." };
  }

  try {
    const updatedBrand = await prisma.brand.update({
      where: { id: Number(brandId) }, // Ensure ID is a number
      data: { name: brandData.name },
    });

    revalidatePath("/dashboard/settings");
    return {
      success: true,
      message: "Brand updated successfully.",
      data: updatedBrand,
    };
  } catch (err) {
    console.error("updateBrandAction Error:", err);
    if (err.code === "P2025") {
      // Record to update not found
      return { success: false, error: "Brand not found." };
    } else if (err.code === "P2002") {
      return {
        success: false,
        error: "A brand with this name already exists.",
      };
    }
    return { success: false, error: "Failed to update brand." };
  }
}
