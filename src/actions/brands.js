"use server";

import prisma from "@/data/prisma";

export async function fetchBrands() {
  // * return brands.
  const brands = await prisma.brand.findMany({
    select: {
      id: true,
      name: true,
    },
  });

  return brands;
}

export async function addBrand({ brandName }) {
  // * Add a new brand and return it.
  const newBrand = await prisma.brand.create({
    data: {
      name: brandName,
    },
  });

  return newBrand;
}

export async function removeBrand({ brandName }) {
  // * Delete brand where name is brandName.
  // ** The name must be unique.
  const deletedBrand = await prisma.brand.delete({
    where: {
      name: brandName,
    },
  });

  return deletedBrand;
}
