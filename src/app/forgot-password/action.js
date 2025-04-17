"use server";

import { redirect } from "next/navigation";

import prisma from "@/data/prisma";
import { RecoveryCodeEmail } from "@/emails/recovery-code";

// * Validation schema.
import { loginFormSchema } from "@/data/validation/login-form";
// * Extract only the email for validation.
const forgotPasswordSchema = loginFormSchema.pick(["email"]);

export default async function ForgotPasswordAction(state, formData) {
  // * Reset state errors and message.
  // * Set state data from formData.
  state = {
    errors: {},
    message: "",
    data: Object.fromEntries(formData),
  };

  const recoverData = {
    email: formData.get("email"),
  };

  // * Will hold valid data.
  let validData;

  try {
    validData = await forgotPasswordSchema.validate(recoverData, {
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

  // * Fetch user by its email
  const user = await prisma.user.findFirst({
    where: { email: validData.email },
  });

  // * Return message if user does not exists.
  if (!user) {
    return (state = { ...state, message: "This user does not exist." });
  }

  // * Generate a random 6 digit code.
  const randomCode = Math.floor(100000 + Math.random() * 900000);

  // * Inser code into user's record
  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: { code: randomCode },
  });

  // * Return message if user could not be updated.
  if (!updatedUser) {
    return (state = {
      ...state,
      message: "Error! Could not send the recovery code.",
    });
  }

  const sendRecoverEmail = await RecoveryCodeEmail({
    code: randomCode,
    name: updatedUser.name,
    email: updatedUser.email,
  });

  // * Return message if email was not sent.
  if (!sendRecoverEmail) {
    return (state = {
      ...state,
      message:
        "We had problems sending the recovery code. Please check your email and try again.",
    });
  }

  return redirect("/reset-password");
}
