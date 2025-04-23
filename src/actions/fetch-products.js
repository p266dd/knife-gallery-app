"use server";

import prisma from "@/data/prisma";

export async function fetchProducts({ searchQuery, page, itemsPerPage }) {
  // * return paginated results.
  let config = {
    select: {
      id: true,
      name: true,
      type: true,
    },
  };

  // * Handle the search query if user is searching for something.
  if (searchQuery) {
    config = {
      ...config,
      where: {
        name: { contains: searchQuery },
      },
    };
  }

  const products = await prisma.product.findMany(config);

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
    },
  });

  return product;
}
