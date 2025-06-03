"use server";

import { hashSync } from "bcryptjs";
import prisma from "@/data/prisma";
import { generateRandomString } from "@/utils/generate-random-string";

// * Validation schema.
import { registerFormSchema } from "@/data/validation/register-form";
import { NewRegisterUserEmail } from "@/emails/register";

export default async function RegisterAction(state, formData) {
  const newBusinessCode = generateRandomString("businessCode");

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
    businessCode: newBusinessCode,
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

    // Send email to user.
    const sendRegisterEmail = await NewRegisterUserEmail({
      name: newUser.name,
      email: newUser.email,
    });

    // * Return message if email was not sent.
    if (!sendRegisterEmail) {
      return {
        ...newState,
        message:
          "We had problems sending a copy to your email. Please wait while we review your application",
      };
    }

    // * Set state with a success message.
    return {
      ...newState,
      success: true,
      message: "You account has been created. Please wait while we review your application.",
    };
  } catch (error) {
    console.log(error);
    return {
      ...newState,
      message: "Error! Could not create account.",
    };
  }
}
