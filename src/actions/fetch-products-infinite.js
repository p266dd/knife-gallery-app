"use server";

import prisma from "@/data/prisma";

export async function fetchProductsInfinite({ pageIndex, filter }) {
  const perPage = 12;

  const products = await prisma.product.findMany({
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

  const startIndex = pageIndex * perPage;
  const paginatedData = products.slice(startIndex, startIndex + perPage);

  return paginatedData;
}
