"use server";

import prisma from "@/data/prisma";
import { hashSync } from "bcryptjs";
import { userSchema } from "@/data/validation/user";
import { verifyUserSession } from "@/utils/session";
import { revalidatePath } from "next/cache";

export default async function updateOwnUser(state, formData) {
  const session = await verifyUserSession();
  const newState = { ...state, data: Object.fromEntries(formData) };

  const user = {
    name: newState?.data?.name,
    email: newState?.data?.email,
    businessCode: newState?.data?.businessCode,
    businessName: newState?.data?.businessName,
    engraving: newState?.data?.engraving,
  };

  if (newState?.data.password) {
    // * Hash password and add to data object.
    user["password"] = hashSync(data.password, 10);
  }

  // * Validate user data or return validation error.
  let validatedData;
  try {
    validatedData = await userSchema
      .omit(["isActive", "role", "password"])
      .validate(user, {
        abortEarly: false,
      });
  } catch (error) {
    // * Cath validation errors.
    if (error.name === "ValidationError") {
      const fieldErrors = {};
      for (const fieldError of error.inner) {
        fieldErrors[fieldError.path] = fieldError.message;
      }
      return { ...state, errors: fieldErrors };
    }

    // * Log any other error.
    console.log(error);
  }

  try {
    const newUser = await prisma.user.update({
      where: {
        id: session.id,
      },
      data: user,
    });

    revalidatePath("/account", "page");

    return { ...state, message: "User updated successfully!" };
  } catch (error) {
    console.log(error);
    return {
      ...state,
      error: "Could not update user, refresh page and try again!",
    };
  }
}
