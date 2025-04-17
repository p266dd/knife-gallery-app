import { object, string, ref } from "yup";

export const resetPasswordSchema = object({
  code: string()
    .length(6, "Your code must contain 6 characters.")
    .trim()
    .nullable(),

  password: string()
    .min(6, "Password must be at least 6 characters.")
    .max(100, "Password is in wrong format.")
    .matches(
      '^(?=.*[!@#$%^&*(),.?":{}|<>-_+=\\`~])(?=.*[0-9]).{2,}$',
      "Password must contain at least 1 special character and 1 number."
    )
    .nullable()
    .trim(),

  confirmPassword: string()
    .oneOf([ref("password")], "Passwords must match.")
    .trim()
    .nullable(),
});
