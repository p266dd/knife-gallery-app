"use server";

import prisma from "@/data/prisma";
import { skip } from "@prisma/client/runtime/library";

export async function fetchProductsInfinite({ pageIndex, filter }) {
  // This number is based on 4 rows of 3 items on mobile.
  const perPage = 12;

  try {
    const products = await prisma.product.findMany({
      skip: pageIndex * perPage, // More efficient to handle pagination in the prisma query.
      take: perPage,
      include: {
        filters: true,
        media: true,
        thumbnail: true,
      },
      where: filter
        ? {
            filters: {
              some: {
                name: {
                  equals: filter,
                  mode: "insensitive",
                },
              },
            },
          }
        : {},
      orderBy: {
        createdAt: "desc",
      },
    });

    return products;
  } catch (error) {
    console.log(error);
    return [];
  }
}
