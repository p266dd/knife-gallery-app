"use server";

import { redirect } from "next/navigation";
import { compareSync } from "bcryptjs";

import prisma from "@/data/prisma";
import { createSession } from "@/utils/session";

// * Validation schema.
import { loginFormSchema } from "@/data/validation/login-form";

export default async function LoginAction(state, formData) {
  // * Holds the new state.
  const newState = {
    errors: [],
    message: "",
    data: Object.fromEntries(formData),
  };

  const loginData = {
    email: newState.data["email"],
    password: newState.data["password"],
  };

  // * Holds valid data.
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
      return { ...newState, errors: fieldErrors };
    }

    // * Log any other error.
    console.log(error);
  }

  // * Holds the user's return information.
  let user;
  try {
    user = await prisma.user.findFirst({
      where: { email: validData.email },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
        role: true,
        isActive: true,
      },
    });
  } catch (error) {
    return { ...newState, message: "An error occured." };
  }

  if (!user) return { ...newState, message: "User does not exist." };

  // * Check password.
  const passwordsMatch = compareSync(validData.password, user.password);
  if (!passwordsMatch)
    return { ...newState, message: "Incorrect email or password." };

  // * Check if user is currently active.
  if (!user.isActive)
    return {
      ...newState,
      message: "User is not active. Please wait while we review.",
    };

  // * Create session for the user.
  // session will be stored in a httpOnly and user's localStorage.
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
