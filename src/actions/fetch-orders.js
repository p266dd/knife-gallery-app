"use server";

import prisma from "@/data/prisma";
import { verifyAdminSession } from "@/utils/session";
import { verifyUserSession } from "@/utils/session";

export async function fetchOrders({
  searchQuery,
  page,
  itemsPerPage,
  newOnly,
}) {
  await verifyAdminSession();
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

export async function fetchOrdersClient({ searchQuery, page, itemsPerPage }) {
  const { id } = await verifyUserSession();

  const orders = await prisma.order.findMany({
    where: {
      clientId: id,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      client: {
        select: {
          businessName: true,
          name: true,
        },
      },
      orderProduct: true,
    },
  });

  const startIndex = (page - 1) * itemsPerPage;
  const paginatedData = orders.slice(startIndex, startIndex + itemsPerPage);
  const totalCount = orders.length;
  const totalPages = Math.ceil(totalCount / itemsPerPage);

  return { data: paginatedData, totalCount, totalPages, currentPage: page };
}

export async function fetchSingleOrder({ orderId }) {
  await verifyUserSession();
  // * return a single order.
  const order = await prisma.order.findUnique({
    where: {
      id: orderId,
    },
    include: {
      client: {
        select: {
          businessName: true,
          name: true,
        },
      },
      orderProduct: {
        include: {
          product: {
            include: {
              media: true,
              thumbnail: true,
              sizes: true,
            },
          },
        },
      },
    },
  });

  return order;
}
