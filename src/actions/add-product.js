"use server";

import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import prisma from "@/data/prisma";

import { storage } from "@/utils/firebase";
import { verifyAdminSession } from "@/utils/session";

import { knifeSchema } from "@/data/validation/knife";
import { otherProductSchema } from "@/data/validation/other-product";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export default async function addProduct(formData) {
  await verifyAdminSession();

  let validatedData;
  // * Validate product data or return validation error.
  try {
    validatedData =
      formData.type == "other"
        ? await otherProductSchema.validate(formData, {
            abortEarly: false,
          })
        : await knifeSchema.validate(formData, {
            abortEarly: false,
          });
  } catch (error) {
    // * Cath validation errors.
    if (error.name === "ValidationError") {
      const fieldErrors = {};
      for (const fieldError of error.inner) {
        if (fieldError.path.split("[")[0] === "sizes") {
          fieldErrors[fieldError.path.split("[")[0]] = `${fieldError.message} [
            ${fieldError.value} ]`;
        } else {
          fieldErrors[fieldError.path] = fieldError.message;
        }
      }
      // console.log("Errors: ", fieldErrors);
      return { errors: fieldErrors };
    }

    // * Log any other error.
    console.log(error);
  }

  let mediaObject;
  if (validatedData?.media && validatedData?.media.length > 0) {
    // upload images to storage
    const imageUrls = await Promise.all(
      validatedData.media.map(async (image) => {
        const docRef = ref(storage, `products/${image.name}`);
        const snapshot = await uploadBytes(docRef, image.blob);
        const downloadURL = await getDownloadURL(snapshot.ref);
        return {
          name: image.name,
          url: downloadURL,
        };
      })
    );

    // * Prepare the media object to help create and connect medias to product.
    mediaObject = imageUrls.map((image) => ({
      name: image.name,
      url: image.url,
    }));
  }

  // * Prepare the sizes object to help create and connect sizes to product.
  const sizesObject = validatedData.sizes.map((size) => ({
    name: size.name,
    size: size.size,
    price: size.price,
    stock: size.stock,
  }));

  // * Prepare the filters object to help create and connect filters to product.
  let filtersObject = [];
  if (validatedData?.filters && validatedData?.filters.length > 0) {
    filtersObject = validatedData.filters.map((filter) => filter.id);
  }

  let product;
  try {
    // * Create media, sizes when adding product.
    product = await prisma.product.create({
      data: {
        type: validatedData.type,
        name: validatedData.name,
        description: validatedData.description,
        brand: validatedData.brand,
        handle: validatedData.handle || "No Handle",
        canChangeHandle: validatedData.canChangeHandle,
        style: validatedData.style || "No Style",
        material: validatedData.material || "No Material",
        media: {
          create: mediaObject,
        },
        sizes: {
          create: sizesObject,
        },
        filters: {
          connect: filtersObject.map((id) => ({ id })),
        },
      },
    });
  } catch (error) {
    console.log(error);
    return {
      errors: ["An error accurred"],
    };
  }

  // * Now, we only need to connect the thumbail
  // based on the media's id that matches the thumbnail name.
  let thumbnailId;
  if (validatedData?.thumbnail) {
    try {
      thumbnailId = await prisma.media.findFirst({
        where: {
          name: {
            equals: validatedData.thumbnail.name,
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

    try {
      const updatedProduct = await prisma.product.update({
        where: {
          id: product.id,
        },
        data: {
          thumbnail: {
            connect: {
              id: thumbnailId.id,
            },
          },
        },
      });
    } catch (error) {
      console.log(error);
      return { errors: [error.message] };
    }
  }

  revalidatePath("/dashboard/products");

  return redirect("/dashboard/products");
}
