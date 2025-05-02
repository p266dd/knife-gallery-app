"use server";

import prisma from "@/data/prisma";
import { redirect } from "next/navigation";
import { userSchema } from "@/data/validation/user";
import { verifyAdminSession } from "@/utils/session";
import { revalidatePath } from "next/cache";

export default async function addUser(state, formData) {
  await verifyAdminSession();

  // * Reset errors and message.
  state = { ...state, errors: null, message: null };

  const data = Object.fromEntries(formData);

  const user = {
    name: data.name,
    email: data.email,
    password: data.password,
    businessName: data.businessName,
    businessCode: data.businessCode,
    role: data.role,
    isActive: Boolean(Number(data.isActive || "0")),
  };

  // * Validate data
  let validatedData;
  try {
    validatedData = await userSchema.validate(user, {
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

  // * Add user's validateddata to state.
  state = { ...state, ...validatedData };

  // * User email already registered?
  let alreadyRegistered;
  try {
    alreadyRegistered = await prisma.user.findUnique({
      where: {
        email: data.email,
      },
      select: {
        email: true,
      },
    });
  } catch (e) {
    console.log(e);
    return { ...state, message: "A critical error occured." };
  }

  // * Assert if user does not exist by returning early if user exists.
  if (alreadyRegistered) {
    return { ...state, errors: { email: "User is already registered." } };
  }

  let newUser;
  try {
    newUser = await prisma.user.create({
      data: {
        ...validatedData,
      },
    });
  } catch (e) {
    return { ...state, message: "A critical error occured." };
  }

  state = { ...state, message: "validation successfull." };

  revalidatePath("/dashboard/users", "page");
  return redirect("/dashboard/users");
}
