"use server";

import prisma from "@/data/prisma";

export async function fetchSizes({ productId }) {
  // * return productSizes.
  const sizes = await prisma.product.findUnique({
    where: {
      id: productId,
    },
    select: {
      id: true,
      name: true,
      sizes: true,
    },
  });
  console.log("Sizes", sizes);

  return sizes;
}

export async function addToSizes(data) {
  // * Add a new size and return it.
  const newSize = await prisma.size.create({
    data: {
      name: data.name,
      size: Number(data.size),
      price: Number(data.price),
      stock: Number(data.stock),
      product: {
        connect: { id: data.productId },
      },
    },
  });

  return newSize;
}

export async function updateSize(data) {
  // * Add a new size and return it.
  const updatedSize = await prisma.size.update({
    where: {
      id: data.id,
    },
    data: {
      name: data.name,
      size: Number(data.size),
      price: Number(data.price),
      stock: Number(data.stock),
      product: {
        connect: { id: data.productId },
      },
    },
  });

  return updatedSize;
}

export async function deleteSize(sizeId) {
  // * Delete size by Id
  const deletedSize = await prisma.size.delete({
    where: {
      id: sizeId,
    },
  });

  return deletedSize;
}
