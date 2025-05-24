"use server";

import { hashSync } from "bcryptjs";
import prisma from "@/data/prisma";

// * Validation schema.
import { registerFormSchema } from "@/data/validation/register-form";

export default async function RegisterAction(state, formData) {
  // * Set newState data from formData.
  const newState = {
    errors: [],
    message: "",
    data: Object.fromEntries(formData),
  };

  const signupData = {
    name: newState.data.name,
    email: newState.data.email,
    password: newState.data.password,
    businessName: newState.data.businessName,
    businessCode: newState.data.businessCode,
  };

  // * Holds the validated data.
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
      return { ...newState, errors: fieldErrors };
    }

    // * Log any other error.
    console.log(error);
  }

  // * Fetch user by its email.
  const userExists = await prisma.user.findFirst({
    where: { email: validData.email },
  });

  // * Return message if user exists already.
  if (userExists) {
    return {
      ...newState,
      message: "User already exists. Try signing in.",
    };
  }

  // * Hash user's password.
  const hashPassword = hashSync(validData.password, 10);

  try {
    // * Create a user with the valid data and hased password.
    const newUser = await prisma.user.create({
      data: { ...validData, password: hashPassword },
    });

    // * Return an error message if user was not created.
    if (!newUser) {
      return {
        ...newState,
        message: "Error! Could not create account.",
      };
    }

    // * Set state with a success message.
    return {
      ...newState,
      success: true,
      message:
        "You account has been created. Please wait while we review your application.",
    };
  } catch (error) {
    console.log(error);
    return {
      ...newState,
      message: "Error! Could not create account.",
    };
  }
}
