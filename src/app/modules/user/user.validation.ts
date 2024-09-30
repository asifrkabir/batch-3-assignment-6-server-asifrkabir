import { z } from "zod";

const createUserValidationSchema = z.object({
  body: z.object({
    name: z
      .string({
        required_error: "Name is required",
        invalid_type_error: "Name must be a valid string",
      })
      .min(1, { message: "Name is required" }),
    email: z
      .string({ required_error: "Email is required" })
      .email({ message: "Invalid email address" })
      .min(1, { message: "Email is required" }),
    password: z
      .string({
        required_error: "Password is required",
        invalid_type_error: "Password must be a valid string",
      })
      .min(1, { message: "Password is required" }),
    phone: z
      .string({
        required_error: "Phone number is required",
        invalid_type_error: "Phone number must be a valid string",
      })
      .min(1, { message: "Phone number is required" }),
    address: z
      .string({
        required_error: "Address is required",
        invalid_type_error: "Address must be a valid string",
      })
      .min(1, { message: "Address is required" }),
  }),
});

export const UserValidations = {
  createUserValidationSchema,
};
