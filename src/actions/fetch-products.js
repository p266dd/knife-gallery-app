"use server";

import prisma from "@/data/prisma";

export async function fetchProducts({ page, itemsPerPage }) {
  // * return paginated results.
  const products = await prisma.product.findMany({
    select: {
      id: true,
      name: true,
      type: true,
      brand: {
        select: {
          name: true,
        },
      },
    },
  });

  const startIndex = (page - 1) * itemsPerPage;
  const paginatedData = products.slice(startIndex, startIndex + itemsPerPage);
  const totalCount = products.length;
  const totalPages = Math.ceil(totalCount / itemsPerPage);

  return { data: paginatedData, totalCount, totalPages, currentPage: page };
}

export async function fetchSingleProduct({ productId }) {
  // * return a single product.
  const product = await prisma.product.findUnique({
    where: {
      id: productId,
    },
    select: {
      id: true,
      name: true,
      type: true,
      brand: {
        select: {
          name: true,
        },
      },
    },
  });

  return product;
}
