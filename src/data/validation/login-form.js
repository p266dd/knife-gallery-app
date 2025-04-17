import { object, string } from "yup";

export const loginFormSchema = object({
  email: string()
    .required("Email is required.")
    .email()
    .matches(
      "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$",
      "Must be a valid email."
    )
    .trim(),

  password: string()
    .required("Password is required.")
    .min(6, "Password must be at least 6 characters.")
    .max(20, "Password is in wrong format.")
    .matches(
      '^(?=.*[!@#$%^&*(),.?":{}|<>-_+=\\`~])(?=.*[0-9]).{2,}$',
      "Password must contain at least 1 special character and 1 number."
    )
    .trim(),
});
