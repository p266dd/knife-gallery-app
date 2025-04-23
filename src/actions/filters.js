"use server";

import prisma from "@/data/prisma";

export async function fetchFilters() {
  // * return filters.
  const filters = await prisma.filter.findMany({
    select: {
      id: true,
      name: true,
    },
  });

  return filters;
}

export async function addFilter({ filterName, productId = null }) {
  // * Add a new filter and return it.
  if (productId) {
    const newFilter = await prisma.filter.create({
      data: {
        name: filterName,
        product: {
          connect: { id: productId },
        },
      },
    });

    return newFilter;
  }

  const newFilter = await prisma.filter.create({
    data: {
      name: filterName,
    },
  });

  return newFilter;
}

export async function deleteFilter({ filterName }) {
  // * Delete filter where name is filterName.
  // ** The name must be unique.
  const deletedFilter = await prisma.filter.delete({
    where: {
      name: filterName,
    },
  });

  return deletedFilter;
}
