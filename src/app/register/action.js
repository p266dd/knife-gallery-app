"use server";

import { hashSync } from "bcryptjs";
import prisma from "@/data/prisma";

// * Validation schema.
import { registerFormSchema } from "@/data/validation/register-form";

export default async function RegisterAction(state, formData) {
  // * Reset state errors and message.
  // * Set state data from formData.
  state = { errors: [], message: "", data: Object.fromEntries(formData) };

  const signupData = {
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    businessName: formData.get("businessName"),
    businessCode: formData.get("businessCode"),
  };

  // * Will hold valid data.
  let validData;

  try {
    validData = await registerFormSchema.validate(signupData, {
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

  // * Fetch user by its email.
  const userExists = await prisma.user.findFirst({
    where: { email: validData.email },
  });

  // * Return message f user exists.
  if (userExists) {
    return (state = {
      ...state,
      message: ["User already exists. Try signing in."],
    });
  }

  // * Check if password is a match.
  const hashPassword = hashSync(validData.password, 10);

  // * Create a user with the valid data and hased password.
  const newUser = await prisma.user.create({
    data: { ...validData, password: hashPassword },
  });

  // * Return an error message if user was not created.
  if (!newUser) {
    return (state = {
      ...state,
      message: ["Error! Could not create account."],
    });
  }

  // * Set state with a success message.
  return (state = {
    ...state,
    success: true,
    message:
      "You account has been created. Please wait while we review your application.",
  });
}
