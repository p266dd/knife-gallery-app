import { object, string, number, array, boolean } from "yup";

export const otherProductSchema = object({
  type: string().oneOf(["other"]).required("Please select a type."),
  name: string().required("Please write a product title.").max(90, "Title is too long.").trim(),
  description: string().max(400, "Description is too long.").trim(),
  brand: string().required("Please select a brand.").max(50).trim(),
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
        name: string().required("Please type a size.").max(26, "Size is too long.").trim(),
        size: string().required("Please type a size."),
        price: number()
          .required("Please type a price.")
          .integer("Price must be an integer.")
          .min(1000, "Price must be at least ¥1000."),
        stock: number()
          .required("Please type a stock.")
          .integer("Stock must be an integer.")
          .min(0, "Stock must be at least 0."),
      })
    )
    .required("Please enter at least one product size.")
    .max(20, "You can only enter up to 20 sizes."),
});
