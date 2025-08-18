// import { z } from "zod";

// export const signupSchema = z
//   .object({
//     //name: z.string().min(2, "Name is required"),
//     email: z.string().email("Invalid email address"),
//     password: z.string().min(6, "Password must be at least 6 characters"),
//     //confirmPassword: z.string().min(6, "Confirm your password"),
//   })
//   .refine((data) => data.password === data.confirmPassword, {
//     message: "Passwords do not match",
//     path: ["confirmPassword"],
//   });

// export type SignupFormValues = z.infer<typeof signupSchema>;

import { z } from "zod";

export const signupSchema = z
  .object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(8),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type SignupFormValues = z.infer<typeof signupSchema>;
