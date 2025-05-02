"use server";

import prisma from "@/data/prisma";

export async function fetchProducts({
  searchQuery,
  filterType,
  page,
  itemsPerPage,
}) {
  // * return paginated results.
  let config = {
    select: {
      id: true,
      name: true,
      type: true,
      handle: true,
      material: true,
      thumbnail: true,
    },
    where: {},
    orderBy: {
      name: "asc",
    },
  };

  // * Handle the search query if user is searching for something.
  if (searchQuery) {
    config = {
      ...config,
      where: {
        AND: [
          {
            name: {
              contains: searchQuery,
            },
          },
        ],
      },
    };
  }

  // * Handle the filter type if user has selected it.
  if (filterType) {
    config = {
      ...config,
      where: {
        ...config.where,
        OR: [
          {
            type: { equals: filterType },
          },
          {
            filters: {
              some: {
                name: {
                  contains: filterType,
                },
              },
            },
          },
        ],
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
