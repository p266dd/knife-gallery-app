"use server";

import prisma from "@/data/prisma";

export async function updateOrderProductDetailsRow({ docId, newData }) {
  // * Get the details from orderProduct id docId
  const orderProduct = await prisma.orderProduct.findUnique({
    where: { id: docId },
  });

  const details = JSON.parse(orderProduct.details);

  // * Create an object with the updated data.
  const newObject = [];
  details.map((d) => {
    if (d.id === newData.id) return newObject.push(newData);
    return newObject.push(d);
  });

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
