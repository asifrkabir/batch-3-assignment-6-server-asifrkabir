import { z } from "zod";

const loginValidationSchema = z.object({
  body: z.object({
    email: z
      .string({ required_error: "Email is required" })
      .email({ message: "Invalid email address" }),
    password: z.string({
      required_error: "Password is required",
      invalid_type_error: "Password must be a valid string",
    }),
  }),
});

const refreshTokenValidationSchema = z.object({
  cookies: z.object({
    refreshToken: z.string({ required_error: "Refresh Token is required" }),
  }),
});

export const AuthValidations = {
  loginValidationSchema,
  refreshTokenValidationSchema,
};
