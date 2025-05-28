"use server";

import prisma from "@/data/prisma";
import { verifyAdminSession } from "@/utils/session";
import { verifyUserSession } from "@/utils/session";

export async function fetchOrders({
  searchQuery,
  page,
  itemsPerPage,
  newOnly = false,
}) {
  await verifyAdminSession();
  // * return only new orders, and shallow query.
  const orders = await prisma.order.findMany({
    take: itemsPerPage,
    skip: (page - 1) * itemsPerPage,
    where: {
      isCompleted: !newOnly,
      AND: searchQuery
        ? [
            {
              OR: [
                { code: { contains: searchQuery } },
                {
                  client: {
                    businessName: {
                      contains: searchQuery,
                      mode: "insensitive",
                    },
                  },
                },
              ],
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

  const totalCount = orders.length;
  const totalPages = Math.ceil(totalCount / itemsPerPage);

  return { data: orders, totalCount, totalPages, currentPage: page };
}

export async function fetchOrdersClient({ searchQuery, page, itemsPerPage }) {
  const { id } = await verifyUserSession();

  const orders = await prisma.order.findMany({
    take: itemsPerPage,
    skip: (page - 1) * itemsPerPage,
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

  const totalCount = orders.length;
  const totalPages = Math.ceil(totalCount / itemsPerPage);

  return { data: orders, totalCount, totalPages, currentPage: page };
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
