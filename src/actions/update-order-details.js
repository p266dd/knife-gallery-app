"use server";

import prisma from "@/data/prisma";

export async function updateOrderProductDetailsRow({ docId, newData }) {
  // * Get the details from orderProduct id docId
  const orderProduct = await prisma.orderProduct.findUnique({
    where: { id: docId },
  });

  const details = JSON.parse(orderProduct.details);

  const newObject = [];

  for (const detail of details) {
    if (Number(detail.id) === newData.id) {
      newObject.push(newData);
    } else {
      newObject.push(detail);
    }
  }

  try {
    const updatedDoc = await prisma.orderProduct.update({
      where: {
        id: docId,
      },
      data: {
        details: JSON.stringify(newObject),
      },
    });

    return updatedDoc;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function updateOrderProductDetailsProduct({ docId, newData }) {
  const updatedDoc = await prisma.orderProduct.update({
    where: {
      id: docId,
    },
    data: {
      brand: newData.brand,
      handle: newData.handle,
      request: newData.request,
    },
  });

  return updatedDoc;
}
