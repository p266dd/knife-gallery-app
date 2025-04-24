"use server";

import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { isEqual } from "lodash";
import prisma from "@/data/prisma";

import { storage } from "@/utils/firebase";
import { verifyAdminSession } from "@/utils/session";

import { knifeSchema } from "@/data/validation/knife";
import { otherProductSchema } from "@/data/validation/other-product";

export default async function updateProduct(productData, current) {
  await verifyAdminSession();

  let validatedData;

  // * Validate product data or return validation error.
  try {
    validatedData =
      productData.type == "knife"
        ? await knifeSchema.validate(productData, {
            abortEarly: false,
          })
        : await otherProductSchema.validate(productData, {
            abortEarly: false,
          });
  } catch (error) {
    // * Cath validation errors.
    console.log(error);
    return { errors: ["Validation failed"] };
  }

  // * Return an object with only the fields that aren't same.
  const updatedData = Object.fromEntries(
    Object.entries(validatedData).filter(
      ([key, value]) => !isEqual(value, current[key])
    )
  );

  // * Object to hold the images.
  let newMediaObject = {};
  let keptImages = [];
  let deletedImages = [];
  let newImages = [];

  // * Handle the deleted, added and keept images.
  keptImages = productData.media.filter((m) =>
    current.media.some((v) => v.name === m.name)
  );
  deletedImages = current.media.filter(
    (m) => !productData.media.some((v) => v.name === m.name)
  );
  newImages = productData.media.filter(
    (m) => !current.media.some((v) => v.name === m.name)
  );

  // * Delete unused images.
  if (deletedImages.length > 0) {
    deletedImages.map(async (image) => {
      const storageRef = ref(storage, `products/${image.name}`);
      return await deleteObject(storageRef);
    });
  }

  // * Upload new images and add to object.
  if (newImages.length > 0) {
    newImages = await Promise.all(
      newImages.map(async (image) => {
        const storageRef = ref(storage, `products/${image.name}`);
        const snapshot = await uploadBytes(storageRef, image.blob);
        const downloadURL = await getDownloadURL(snapshot.ref);
        return {
          name: image.name,
          url: downloadURL,
        };
      })
    );
  }

  if (newImages.length > 0) {
    newMediaObject = {
      ...newMediaObject,
      create: newImages,
    };
  }

  if (deletedImages.length > 0) {
    newMediaObject = {
      ...newMediaObject,
      disconnect: deletedImages.map((image) => ({ id: image.id })),
    };

    // * Delete images from database.
    deletedImages.map(
      async (image) =>
        await prisma.media.delete({
          where: { id: image.id },
        })
    );
  }

  // * Prepare the sizes object to help create and connect sizes to product.
  // Only if sizes object has changed
  let keptSizes, deletedSizes, newSizes;
  let newSizeObject = {};

  keptSizes = productData.sizes.filter((m) =>
    current.sizes.some((v) => v.name === m.name)
  );
  deletedSizes = current.sizes.filter(
    (m) => !productData.sizes.some((v) => v.name === m.name)
  );
  newSizes = productData.sizes.filter(
    (m) => !current.sizes.some((v) => v.name === m.name)
  );

  // * Delete unused sizes.
  if (deletedSizes.length > 0) {
    deletedSizes.map(
      async (size) =>
        await prisma.size.delete({
          where: { id: size.id },
        })
    );

    newSizeObject = {
      ...newSizeObject,
      disconnect: deletedSizes.map((size) => ({ id: size.id })),
    };
  }

  // * Create new sizes
  if (newSizes.length > 0) {
    newSizeObject = {
      ...newSizeObject,
      create: newSizes,
    };
  }

  // * Prepare the filters object to help create and connect filters to product.
  // Only if the filter object has changed.
  let keptFilters, deletedFilters, newFilters;
  let newFilterObject = {};

  keptFilters = productData.filters.filter((m) =>
    current.filters.some((v) => v.name === m.name)
  );
  deletedFilters = current.filters.filter(
    (m) => !productData.filters.some((v) => v.name === m.name)
  );
  newFilters = productData.filters.filter(
    (m) => !current.filters.some((v) => v.name === m.name)
  );

  // * Unlink unused filters.
  if (deletedFilters.length > 0) {
    newFilterObject = {
      ...newFilterObject,
      disconnect: deletedFilters.map((filter) => ({ id: filter.id })),
    };
  }

  // * Link new filters
  if (newFilters.length > 0) {
    newFilterObject = {
      ...newFilterObject,
      connect: newFilters,
    };
  }

  let product;
  try {
    // * Create media, sizes when adding product.
    product = await prisma.product.update({
      where: {
        id: current.id,
      },
      data: {
        type: validatedData.type,
        name: validatedData.name,
        description: validatedData.description,
        brand: validatedData.brand,
        handle: validatedData.handle,
        media: newMediaObject,
        sizes: newSizeObject,
        filters: newFilterObject,
      },
    });
  } catch (error) {
    console.log(error);
    return {
      errors: [`Something went wrong`],
    };
  }

  // * Now, we only need to connect the thumbail if [it has changed]
  // based on the media's id that matches the thumbnail name.
  if (updatedData.thumbnail) {
    // Find the id of the media that matches the new thumbnail name
    let newThumbnail;
    try {
      newThumbnail = await prisma.media.findFirst({
        where: {
          name: {
            equals: updatedData.thumbnail.name,
          },
        },
        select: {
          id: true,
        },
      });
    } catch (error) {
      console.log(error);
      return { errors: [error.message] };
    }

    // * Update old thumbnail.
    try {
      await prisma.product.update({
        data: {
          thumbnailId: newThumbnail.id,
        },
        where: {
          id: current.id,
        },
      });
    } catch (error) {
      console.log(error);
      return { errors: [error.message] };
    }
  }

  return true;
}
