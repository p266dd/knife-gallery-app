"use server";

import prisma from "@/data/prisma";
import { redirect } from "next/navigation";
import { userSchema } from "@/data/validation/user";
import { verifyAdminSession } from "@/utils/session";

export default async function updateUser(state, formData) {
  await verifyAdminSession();

  const data = Object.fromEntries(formData);

  const user = {
    name: data.name,
    email: data.email,
    businessCode: data.businessCode,
    businessName: data.businessName,
    role: data.role,
    isActive: Boolean(Number(data.isActive)),
  };

  // * Validate user data or return validation error.
  let validatedData;
  try {
    validatedData = await userSchema.omit(["password"]).validate(user, {
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

  const newUser = await prisma.user.update({
    where: {
      id: data.userId,
    },
    data: user,
  });

  return redirect("/dashboard/users");
}
