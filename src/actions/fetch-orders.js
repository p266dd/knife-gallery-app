"use server";

import prisma from "@/data/prisma";

export async function fetchNewOrders({ page, itemsPerPage }) {
  // * return only new orders, and shallow query.
  const orders = await prisma.order.findMany({
    where: {
      isCompleted: false,
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

export async function fetchOrders({
  searchQuery,
  page,
  itemsPerPage,
  full = false,
}) {
  // * Initialize query configuration.
  let config = {
    where: {
      isCompleted: true,
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
  };

  // * Add all necessary fields to the query if full is true.
  if (full) {
    config = {
      ...config,
      include: {
        client: {
          select: {
            name: true,
            businessName: true,
          },
        },
        orderProduct: {
          select: {
            details: true,
            request: true,
            product: {
              include: {
                sizes: true,
                brand: true,
                media: true,
                thumbnail: true,
              },
            },
          },
        },
      },
    };
  }

  // * Handle the search query if user is searching for something.
  if (searchQuery) {
    config = {
      ...config,
      where: {
        isCompleted: true,
        OR: [
          {
            code: { contains: searchQuery },
          },
          {
            client: {
              businessName: { contains: searchQuery },
            },
          },
        ],
      },
    };
  }

  const orders = await prisma.order.findMany(config);

  const startIndex = (page - 1) * itemsPerPage;
  const paginatedData = orders.slice(startIndex, startIndex + itemsPerPage);
  const totalCount = orders.length;
  const totalPages = Math.ceil(totalCount / itemsPerPage);

  return { data: paginatedData, totalCount, totalPages, currentPage: page };
}
