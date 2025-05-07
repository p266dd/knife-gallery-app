"use server";

import prisma from "@/data/prisma";

export default async function searchProducts({ pageIndex, searchObject }) {
  // * Dynamically build the filter for the 'sizes' relation.
  let sizesFilter = undefined;
  const sizeConditionsForAND = [];

  const perPage = 12;

  // * Add price condition if searchObject.price is provided.
  if (searchObject.price) {
    const prices = searchObject.price.split("-");

    sizeConditionsForAND.push({
      price: {
        gte: Number(prices[0]), // Greater than or equal to minPrice.
        lte: Number(prices[1]), // Less than or equal to maxPrice.
      },
    });
  }

  // * Add size condition if searchObject.size is provided.
  if (searchObject.size) {
    const sizes = searchObject.size.split("-");

    sizeConditionsForAND.push({
      size: {
        gte: Number(sizes[0]), // Greater than or equal to minSize.
        lte: Number(sizes[1]), // Less than or equal to maxSize.
      },
    });
  }

  // * If there are any conditions for the 'Size' model, construct the 'some' filter.
  if (sizeConditionsForAND.length > 0) {
    sizesFilter = {
      some: {
        AND: sizeConditionsForAND,
      },
    };
  }

  // * Construct the main where clause.
  const whereClause = {
    name: {
      contains: searchObject.searchTerm,
    },
    style: searchObject.style,
    material: searchObject.material,
    brand: searchObject.brand,
    sizes: sizesFilter,
  };

  try {
    const products = await prisma.product.findMany({
      where: whereClause,
      include: {
        media: true,
        thumbnail: true,
      },
    });

    const startIndex = pageIndex * perPage;
    const paginatedData = products.slice(startIndex, startIndex + perPage);

    return paginatedData;
  } catch (e) {
    console.log(e);
  }

  return products;
}

export async function searchProduct(term) {
  // * return a list of products if the name contains the term provided.
  const product = await prisma.product.findMany({
    take: 10,
    where: {
      name: {
        contains: term,
      },
    },
    select: {
      id: true,
      name: true,
      thumbnail: true,
      handle: true,
      material: true,
    },
  });

  return product;
}
