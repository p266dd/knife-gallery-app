"use server";

import { hashSync } from "bcryptjs";
import prisma from "@/data/prisma";

// * Validation schema.
import { resetPasswordSchema } from "@/data/validation/reset-password-form";

export default async function ResetPasswordAction(state, formData) {
  // * Set newState data from formData.
  const newState = {
    ...state,
    errors: {},
    message: "",
    data: Object.fromEntries(formData),
  };

  const recoverData = {
    code: newState?.data?.code,
    password: newState?.data?.password,
    confirmPassword: newState?.data?.confirmPassword,
  };

  // * Holds the validated data.
  let validData;
  try {
    validData = await resetPasswordSchema.validate(recoverData, {
      abortEarly: false,
    });
  } catch (error) {
    // * Catch validation errors.
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

  // * Fetch user by the provided code.
  const user = await prisma.user.findFirst({
    where: { code: Number(validData.code) },
  });

  // The function below will only run if the user
  // have not yet sent the code.
  if (!state?.sent) {
    const codesMatch = Number(user.code) === Number(validData.code);
    if (!codesMatch) {
      return {
        ...newState,
        sent: false,
        message: "The code you entered is incorrect.",
      };
    } else {
      return {
        ...newState,
        sent: true,
        message: "Please type your new password.",
      };
    }
  }

  const passwordHash = hashSync(validData.password, 10);

  try {
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { password: passwordHash, code: null },
    });

    return {
      errors: {},
      sent: false,
      message: "Your password has been updated.",
      success: true,
    };
  } catch (error) {
    console.log(error);
    return {
      ...newState,
      sent: true,
      message: "Password could not be updated.",
    };
  }
}
