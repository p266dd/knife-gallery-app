"use server";

import prisma from "@/data/prisma";

export async function updateOrderProductDetailsRow({ docId, newData }) {
  // * Get the details from orderProduct id docId
  const orderProduct = await prisma.orderProduct.findUnique({
    where: { id: docId },
  });

  const details = JSON.parse(orderProduct.details);

  const newObject = [...details];

  if (details.some((detail) => detail.id === newObject.id)) {
    details.map((detail) => {
      if (detail.id === newData.id) return newObject.push(newData);
      return;
    });
  }

  newObject.push(newData);

  const updatedDoc = await prisma.orderProduct.update({
    where: {
      id: docId,
    },
    data: {
      details: JSON.stringify(newObject),
    },
  });

  return updatedDoc;
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
