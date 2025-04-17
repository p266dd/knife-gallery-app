"use server";

import { redirect } from "next/navigation";
import { compareSync } from "bcryptjs";

import prisma from "@/data/prisma";
import { createSession } from "@/utils/session";

// * Validation schema.
import { loginFormSchema } from "@/data/validation/login-form";

export default async function LoginAction(state, formData) {
  // * Reset state errors and message.
  // * Set state data from formData.
  state = { errors: [], message: "", data: Object.fromEntries(formData) };

  const loginData = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  // * Will hold valid data.
  let validData;

  try {
    validData = await loginFormSchema.validate(loginData, {
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

  if (!user) return (state = { ...state, message: "User does not exist." });

  // * Check if password is correct.
  const passwordsMatch = compareSync(validData.password, user.password);

  if (!passwordsMatch)
    return (state = { ...state, message: "Incorrect email or password." });

  // * Check if user is currently active.
  if (!user.isActive)
    return (state = {
      ...state,
      message: "User is not active. Please wait while we review.",
    });

  // * Create session for the user.
  // session will be stored in a httpOnly cookie.
  await createSession({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  });

  // * Redirect to dashboard if role is admin.
  if (user.role === "admin") return redirect("/dashboard");

  return redirect("/");
}
