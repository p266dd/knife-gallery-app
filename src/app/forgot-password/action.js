"use server";

import { redirect } from "next/navigation";

import prisma from "@/data/prisma";
import { RecoveryCodeEmail } from "@/emails/recovery-code";

// * Validation schema, use only the email from it.
import { loginFormSchema } from "@/data/validation/login-form";
const forgotPasswordSchema = loginFormSchema.pick(["email"]);

export default async function ForgotPasswordAction(state, formData) {
  // * Set newState data from formData.
  const newState = {
    errors: {},
    message: "",
    data: Object.fromEntries(formData),
  };

  const recoverData = {
    email: newState.data.email,
  };

  // * Holds the validated data.
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
      return { ...newState, errors: fieldErrors };
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
    return { ...newState, message: "This user does not exist." };
  }

  // * Generate a random 6 digit code to send within the email.
  const randomCode = Math.floor(100000 + Math.random() * 900000);

  let updatedUser;
  try {
    // * Insert code into user's record
    updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { code: randomCode },
    });
  } catch (error) {
    console.log(error);
    return { ...newState, message: "Error! Could not send the recovery code." };
  }

  // This will send the email using nodemailer.
  const sendRecoverEmail = await RecoveryCodeEmail({
    code: randomCode,
    name: updatedUser.name,
    email: updatedUser.email,
  });

  // * Return message if email was not sent.
  if (!sendRecoverEmail) {
    return {
      ...newState,
      message: "We had problems sending the recovery code. Please try again.",
    };
  }

  // * If email was sent redirect user to the next page.
  return redirect("/reset-password");
}
