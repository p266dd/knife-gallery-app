"use server";

import prisma from "@/data/prisma";
import { revalidatePath } from "next/cache";

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

export async function addFilter(filterName) {
  // * Add a new filter and return it.
  const newFilter = await prisma.filter.create({
    data: {
      name: filterName,
    },
  });

  revalidatePath("/dashboard/settings");

  return newFilter;
}

export async function removeFilter(filterId) {
  const deletedFilter = await prisma.filter.delete({
    where: {
      id: filterId,
    },
  });

  revalidatePath("/dashboard/settings");

  return deletedFilter;
}

export async function updateFilter(filter) {
  const updatedFilter = await prisma.filter.update({
    where: {
      id: filter.id,
    },
    data: {
      name: filter.name,
    },
  });

  revalidatePath("/dashboard/settings");

  return updatedFilter;
}
