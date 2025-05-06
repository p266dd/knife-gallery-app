import { object, string, number, array, boolean } from "yup";

export const knifeSchema = object({
  type: string()
    .required("Please select a type.")
    .max(10, "Unexpected type.")
    .trim(),
  name: string()
    .required("Please type a title.")
    .max(50, "Title is too long.")
    .trim(),
  description: string().max(400, "Description is too long.").trim(),
  brand: string()
    .required("Please type a brand.")
    .max(50, "Brand is too long.")
    .trim(),
  handle: string()
    .required("Please select a handle.")
    .max(20, "Handle is too long.")
    .trim(),
  style: string()
    .required("Please select a style.")
    .max(20, "Style is too long.")
    .trim(),
  media: array()
    .required("Please select at least one image.")
    .min(1, "Please select at least one image.")
    .max(8, "You can only upload 8 images."),
  sizes: array()
    .of(
      object({
        name: string()
          .required("Please type a size.")
          .max(20, "Size is too long.")
          .trim(),
        size: number()
          .required("Please type a size.")
          .positive("Size must be a positive number.")
          .integer("Size must be an integer."),
        price: number()
          .required("Please type a price.")
          .positive("Price must be a positive number.")
          .integer("Price must be an integer.")
          .min(1000, "Price must be at least ¥1000."),
        stock: number()
          .required("Please type a stock.")
          .positive("Stock must be a positive number.")
          .integer("Stock must be an integer.")
          .min(0, "Stock must be at least 0."),
      })
    )
    .required("Please select at least one size.")
    .min(1, "Please select at least one size.")
    .max(20, "You can only upload 20 sizes."),
});
