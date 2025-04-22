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

export async function addSize(data) {
  // * Add a new size and return it.
  const newSize = await prisma.size.create({
    data: {
      name: data.name,
      size: Number(data.size),
      price: Number(data.price),
      stock: Number(data.stock),
      productId: data.productId,
    },
  });

  console.log("Added size", newSize);

  return newSize;
}

// export async function removeSize({ handleName }) {
//   // * Delete handle where name is handleName.
//   // ** The name must be unique.
//   const deletedHandle = await prisma.handle.delete({
//     where: {
//       name: handleName,
//     },
//   });

//   return newHandle;
// }
