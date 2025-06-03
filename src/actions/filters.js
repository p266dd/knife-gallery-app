"use server";

import prisma from "@/data/prisma";
import { revalidatePath } from "next/cache";

// Helper to extract filter data from FormData
function getFilterDataFromFormData(formData) {
  return {
    name: formData.get("filterName")?.trim(),
  };
}

export async function fetchFilters() {
  // * returns an array.
  try {
    const filters = await prisma.filter.findMany({
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        name: "asc",
      },
    });
    return filters;
  } catch (error) {
    console.error("fetchFilters Error:", error);
    // Depending on the desired behavior, you might want to throw the error
    // or return an empty array if the component can handle it gracefully.
    return [];
  }
}

export async function addFilterAction(previousState, formData) {
  const filterData = getFilterDataFromFormData(formData);

  if (!filterData.name) {
    return { success: false, error: "Filter name is required." };
  }

  try {
    const newFilter = await prisma.filter.create({
      data: {
        name: filterData.name,
      },
    });

    revalidatePath("/dashboard/settings");
    return {
      success: true,
      message: "Filter added successfully.",
      data: newFilter,
    };
  } catch (err) {
    console.error("addFilterAction Error:", err);
    if (err.code === "P2002") {
      return {
        success: false,
        error: "A filter with this name already exists.",
      };
    }
    return { success: false, error: "Failed to add filter." };
  }
}

export async function removeFilterAction(filterId) {
  if (!filterId) {
    return { success: false, error: "Filter ID is required for removal." };
  }
  try {
    const deletedFilter = await prisma.filter.delete({
      where: {
        id: Number(filterId), // Ensure ID is a number
      },
    });

    revalidatePath("/dashboard/settings");
    return {
      success: true,
      message: "Filter removed successfully.",
      data: deletedFilter,
    };
  } catch (err) {
    console.error("removeFilterAction Error:", err);
    if (err.code === "P2025") {
      // Record to delete not found
      return { success: false, error: "Filter not found." };
    }
    return { success: false, error: "Failed to remove filter." };
  }
}

export async function updateFilterAction(previousState, formData) {
  const filterData = getFilterDataFromFormData(formData);
  const filterId = formData.get("filterId");

  if (!filterId) {
    return { success: false, error: "Filter ID is missing for update." };
  }
  if (!filterData.name) {
    return { success: false, error: "Filter name is required." };
  }

  try {
    const updatedFilter = await prisma.filter.update({
      where: { id: Number(filterId) }, // Ensure ID is a number
      data: { name: filterData.name },
    });

    revalidatePath("/dashboard/settings");
    return {
      success: true,
      message: "Filter updated successfully.",
      data: updatedFilter,
    };
  } catch (err) {
    console.error("updateFilterAction Error:", err);
    if (err.code === "P2025") {
      // Record to update not found
      return { success: false, error: "Filter not found." };
    } else if (err.code === "P2002") {
      return {
        success: false,
        error: "A filter with this name already exists.",
      };
    }
    return { success: false, error: "Failed to update filter." };
  }
}

export async function removeFilter(filterId) {
  const deletedFilter = await prisma.filter.delete({
    where: {
      id: filterId,
    },
  });

  revalidatePath("/dashboard/settings");

  return deletedFilter;
}

export async function updateFilter(filter) {
  const updatedFilter = await prisma.filter.update({
    where: {
      id: filter.id,
    },
    data: {
      name: filter.name,
    },
  });

  revalidatePath("/dashboard/settings");

  return updatedFilter;
}
