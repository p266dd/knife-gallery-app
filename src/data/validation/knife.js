import { object, string, number, array, boolean, lazy } from "yup";

export const knifeSchema = object({
  type: string().oneOf(["knife"]).required("Please select a type."),
  name: string()
    .required("Please write a product title.")
    .max(90, "Title is too long.")
    .trim(),
  description: string().max(400, "Description is too long.").trim(),
  brand: string().required("Please select a brand.").max(50).trim(),
  handle: string().required("Please select a handle.").max(50).trim(),
  material: string().required("Please select a material.").max(50).trim(),
  style: string()
    .required("Please select a style.")
    .oneOf(["japanese", "western"], "Style must be either Western or Japanese.")
    .trim(),
  media: array()
    .required("Please select at least one image.")
    .min(1, "Please select at least one image.")
    .max(10, "You can only upload up to 10 images."),
  thumbnail: object({
    name: string().required("Please select a thumbnail."),
  }),
  sizes: array()
    .of(
      object({
        name: string()
          .required("Please type a size.")
          .max(26, "Name is too long.")
          .trim(),
        size: number()
          .required("Please type a size.")
          .integer("Size must be an integer."),
        price: number()
          .required("Please type a price.")
          .integer("Price must be an integer."),
        stock: number()
          .required("Please type a stock.")
          .integer("Stock must be an integer.")
          .min(0, "Stock must be at least 0."),
      })
    )
    .required("Please enter at least one product size.")
    .max(20, "You can only enter up to 20 sizes."),
});
