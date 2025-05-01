"use server";

import prisma from "@/data/prisma";
import { revalidatePath } from "next/cache";

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

export async function addMaterial(materialName) {
  // * Add a new material and return it.
  const newMaterial = await prisma.material.create({
    data: {
      name: materialName,
    },
  });

  revalidatePath("/dashboard/settings");

  return newMaterial;
}

export async function removeMaterial(materialId) {
  const deletedMaterial = await prisma.material.delete({
    where: {
      id: materialId,
    },
  });

  revalidatePath("/dashboard/settings");

  return deletedMaterial;
}

export async function updateMaterial(material) {
  const updatedMaterial = await prisma.material.update({
    where: {
      id: material.id,
    },
    data: {
      name: material.name,
    },
  });

  revalidatePath("/dashboard/settings");

  return updatedMaterial;
}
