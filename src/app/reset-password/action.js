"use server";

import { hashSync } from "bcryptjs";
import prisma from "@/data/prisma";

// * Validation schema.
import { resetPasswordSchema } from "@/data/validation/reset-password-form";

export default async function ResetPasswordAction(state, formData) {
  // * Reset state errors and message.
  // * Set state data from formData.
  state = {
    ...state,
    errors: {},
    message: "",
    data: Object.fromEntries(formData),
  };

  const recoverData = {
    code: formData.get("code"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  };

  // * Will hold valid data.
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
      return { ...state, errors: fieldErrors };
    }

    // * Log any other error.
    console.log(error);
  }

  // * Fetch user by the valid code.
  const user = await prisma.user.findFirst({
    where: { code: Number(validData.code) },
  });

  if (!state.sent) {
    const codesMatch = Number(user.code) === Number(validData.code);
    if (!codesMatch) {
      return (state = {
        ...state,
        sent: false,
        message: "The code you entered is incorrect.",
      });
    } else {
      return (state = {
        ...state,
        sent: true,
        message: "Please type your new password.",
      });
    }
  }

  const passwordHash = hashSync(validData.password, 10);

  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: { password: passwordHash, code: null },
  });

  if (!updatedUser)
    return (state = {
      ...state,
      message: "Password could not be updated.",
    });

  return (state = {
    errors: {},
    sent: false,
    message: "Your password has been updated.",
    success: true,
  });
}
