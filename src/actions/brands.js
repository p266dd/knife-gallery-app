"use server";

import prisma from "@/data/prisma";
import { revalidatePath } from "next/cache";

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

export async function addBrand(brandName) {
  // * Add a new brand and return it.
  try {
    const newBrand = await prisma.brand.create({
      data: {
        name: brandName,
      },
    });

    revalidatePath("/dashboard/settings");

    return newBrand;
  } catch (err) {
    if (err.code === "P2002") {
      console.log("Item already exists.");
    }
  }
}

export async function removeBrand(brandId) {
  const deletedBrand = await prisma.brand.delete({
    where: {
      id: brandId,
    },
  });

  revalidatePath("/dashboard/settings");

  return deletedBrand;
}

export async function updateBrand(brand) {
  const updatedBrand = await prisma.brand.update({
    where: {
      id: brand.id,
    },
    data: {
      name: brand.name,
    },
  });

  revalidatePath("/dashboard/settings");

  return updatedBrand;
}
