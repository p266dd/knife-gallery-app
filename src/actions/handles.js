"use server";

import prisma from "@/data/prisma";
import { revalidatePath } from "next/cache";

export async function fetchHandles() {
  // * return handles.
  const handles = await prisma.handle.findMany({
    select: {
      id: true,
      name: true,
    },
  });

  return handles;
}

export async function addHandle(handleName) {
  // * Add a new handle and return it.
  const newHandle = await prisma.handle.create({
    data: {
      name: handleName,
    },
  });

  revalidatePath("/dashboard/settings");

  return newHandle;
}

export async function removeHandle(handleId) {
  const deletedHandle = await prisma.handle.delete({
    where: {
      id: handleId,
    },
  });

  revalidatePath("/dashboard/settings");

  return deletedHandle;
}

export async function updateHandle(handle) {
  const updatedHandle = await prisma.handle.update({
    where: {
      id: handle.id,
    },
    data: {
      name: handle.name,
    },
  });

  revalidatePath("/dashboard/settings");

  return updatedHandle;
}
