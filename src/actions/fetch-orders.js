"use server";

import prisma from "@/data/prisma";

export async function fetchOrders({
  searchQuery,
  page,
  itemsPerPage,
  newOnly,
}) {
  // * return only new orders, and shallow query.
  const orders = await prisma.order.findMany({
    where: {
      isCompleted: newOnly,
      OR: searchQuery
        ? [
            {
              code: { contains: searchQuery },
            },
            {
              client: {
                businessName: { contains: searchQuery },
              },
            },
          ]
        : [],
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      client: {
        select: {
          businessName: true,
        },
      },
    },
  });

  const startIndex = (page - 1) * itemsPerPage;
  const paginatedData = orders.slice(startIndex, startIndex + itemsPerPage);
  const totalCount = orders.length;
  const totalPages = Math.ceil(totalCount / itemsPerPage);

  return { data: paginatedData, totalCount, totalPages, currentPage: page };
}
