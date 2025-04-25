"use server";

import prisma from "@/data/prisma";
import { verifyAdminSession } from "@/utils/session";

export async function fetchUsers({
  searchQuery,
  filterType,
  page,
  itemsPerPage,
}) {
  await verifyAdminSession();
  // * return paginated results.
  let config = {
    select: {
      id: true,
      name: true,
      isActive: true,
    },
    where: {},
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
            isActive: { equals: filterType },
          },
        ],
      },
    };
  }

  const users = await prisma.user.findMany(config);

  const startIndex = (page - 1) * itemsPerPage;
  const paginatedData = users.slice(startIndex, startIndex + itemsPerPage);
  const totalCount = users.length;
  const totalPages = Math.ceil(totalCount / itemsPerPage);

  return { data: paginatedData, totalCount, totalPages, currentPage: page };
}

export async function fetchSingleUser({ userId }) {
  await verifyAdminSession();
  // * return a single user.
  const user = await prisma.product.findUnique({
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
