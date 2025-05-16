"use server";

import prisma from "@/data/prisma";

export default async function searchProducts({ pageIndex, searchObject }) {
  // * Dynamically build the filter for the 'sizes' relation.
  let sizesFilter = undefined;
  const sizeConditionsForAND = [];

  let brandFilter = undefined;

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

  // * Add stock condition if searchObject.stock is provided.
  if (searchObject.stock) {
    if (searchObject.stock === "inStock") {
      sizeConditionsForAND.push({
        stock: {
          gt: 0, // Greater than 0
        },
      });
    } else if (searchObject.stock === "largeStock") {
      sizeConditionsForAND.push({
        stock: {
          gt: 50, // Greater than 50
        },
      });
    }
  }

  // * If there are any conditions for the 'Size' model, construct the 'some' filter.
  if (sizeConditionsForAND.length > 0) {
    sizesFilter = {
      some: {
        AND: sizeConditionsForAND,
      },
    };
  }

  // * Add brand to search clause.
  if (searchObject.brand) {
    if (Array.isArray(searchObject.brand) && searchObject.brand.length > 0) {
      // If brand is an array of strings, use the 'in' operator
      brandFilter = { in: searchObject.brand };
    } else if (
      typeof searchObject.brand === "string" &&
      searchObject.brand.trim() !== ""
    ) {
      // If brand is a single, non-empty string, use 'equals'
      brandFilter = { equals: searchObject.brand };
    }
  }

  // * Construct the main where clause.
  const whereClause = {
    name: {
      contains: searchObject.searchTerm,
    },
    style: searchObject.style,
    material: searchObject.material,
    brand: brandFilter,
    sizes: sizesFilter,
  };

  console.log(searchObject);

  try {
    const products = await prisma.product.findMany({
      where: whereClause,
      include: {
        media: true,
        thumbnail: true,
      },
    });

    if (products.length === 0) {
      return [];
    }

    const startIndex = pageIndex * perPage;
    const paginatedData = products.slice(startIndex, startIndex + perPage);

    return paginatedData;
  } catch (e) {
    console.log(e);
    return [];
  }
}

export async function searchProduct(term) {
  // * return a list of products if the name contains the term provided.
  const product = await prisma.product.findMany({
    take: 15,
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
      type: true,
    },
  });

  return product;
}
