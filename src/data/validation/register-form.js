import { object, string } from "yup";

export const registerFormSchema = object({
  name: string()
    .required("Name is required.")
    .max(50, "Name is too long.")
    .trim(),

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
    .max(20, "Password is too long.")
    .matches(
      '^(?=.*[!@#$%^&*(),.?":{}|<>-_+=\\`~])(?=.*[0-9]).{2,}$',
      "Password must contain at least 1 special character and 1 number."
    )
    .trim(),

  businessCode: string()
    .required()
    .length(6, "Code must be 6 characters.")
    .matches("^[A-Z]{2}[0-9]{4}$", "Code must match this format AA1234.")
    .trim(),

  businessName: string()
    .required("Business name is required.")
    .max(100, "Business name is too long.")
    .nullable()
    .trim(),
});
