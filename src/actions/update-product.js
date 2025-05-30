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
import { redirect } from "next/navigation";

export default async function updateProduct(formData, currentProduct) {
  await verifyAdminSession();

  let validatedData;
  // * Validate product data or return validation error.
  try {
    validatedData =
      formData.type == "knife"
        ? await knifeSchema.validate(formData, {
            abortEarly: false,
          })
        : await otherProductSchema.validate(formData, {
            abortEarly: false,
          });
  } catch (error) {
    // * Cath validation errors.
    if (error.name === "ValidationError") {
      const fieldErrors = {};
      for (const fieldError of error.inner) {
        fieldErrors[fieldError.path] = fieldError.message;
      }
      return { errors: fieldErrors };
    }

    // * Log any other error.
    console.log(error);
  }

  // * Return an object with only the fields that aren't same.
  const updatedData = Object.fromEntries(
    Object.entries(validatedData).filter(
      ([key, value]) => !isEqual(value, currentProduct[key])
    )
  );

  // * Object to hold the images.
  let newMediaObject = {};
  let keptImages = [];
  let deletedImages = [];
  let newImages = [];

  // * Handle the deleted, added and keept images.
  keptImages = formData.media.filter((m) =>
    currentProduct.media.some((v) => v.name === m.name)
  );
  deletedImages = currentProduct.media.filter(
    (m) => !formData.media.some((v) => v.name === m.name)
  );
  newImages = formData.media.filter(
    (m) => !currentProduct.media.some((v) => v.name === m.name)
  );

  // * Delete unused images.
  if (deletedImages.length > 0) {
    deletedImages.map(async (image) => {
      const storageRef = ref(storage, `products/${image.name}`);
      try {
        await deleteObject(storageRef);
        await prisma.media.delete({
          where: { id: image.id },
        });
      } catch (error) {
        console.log(error);
      }
    });
  }

  // * Upload new images and add to object.
  if (newImages.length > 0) {
    newImages = await Promise.all(
      newImages.map(async (image) => {
        const docRef = ref(storage, `products/${image.name}`);
        const snapshot = await uploadBytes(docRef, image.blob);
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

  // * Prepare the filters object to help create and connect filters to product.
  // Only if the filter object has changed.
  let keptFilters, deletedFilters, newFilters;
  let newFilterObject = {};

  keptFilters = formData.filters.filter((m) =>
    currentProduct.filters.some((v) => v.name === m.name)
  );
  deletedFilters = currentProduct.filters.filter(
    (m) => !formData.filters.some((v) => v.name === m.name)
  );
  newFilters = formData.filters.filter(
    (m) => !currentProduct.filters.some((v) => v.name === m.name)
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

  try {
    // * Create media, sizes when adding product.
    const product = await prisma.product.update({
      where: {
        id: currentProduct.id,
      },
      data: {
        type: validatedData.type,
        name: validatedData.name,
        description: validatedData.description,
        brand: validatedData.brand,
        handle: validatedData.handle,
        canChangeHandle: validatedData.canChangeHandle,
        style: validatedData.style,
        material: validatedData.material,
        media: newMediaObject,
        // sizes: newSizeObject,
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
          id: currentProduct.id,
        },
      });
    } catch (error) {
      console.log(error);
      return { errors: [error.message] };
    }
  }

  return redirect("/dashboard/products");
}
