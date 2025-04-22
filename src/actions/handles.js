"use server";

import prisma from "@/data/prisma";

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

export async function addHandle({ handleName }) {
  // * Add a new handle and return it.
  const newHandle = await prisma.handle.create({
    data: {
      name: handleName,
    },
  });

  return newHandle;
}

export async function removeHandle({ handleName }) {
  // * Delete handle where name is handleName.
  // ** The name must be unique.
  const deletedHandle = await prisma.handle.delete({
    where: {
      name: handleName,
    },
  });

  return newHandle;
}
