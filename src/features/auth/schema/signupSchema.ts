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
    name: z.string().min(2, "Full name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(8),
    role: z.enum(["customer", "provider"], {
      required_error: "Please select account type",
    }),
    // Optional fields for provider registration
    phone: z.string().optional(),
    category: z.string().optional(),
    location: z.string().optional(),
    experienceYears: z.number().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })
  .refine(
    (data) => {
      // If role is provider, require additional fields
      if (data.role === "provider") {
        return (
          data.phone &&
          data.category &&
          data.location &&
          data.experienceYears !== undefined
        );
      }
      return true;
    },
    {
      message: "All fields are required for service provider registration",
      path: ["phone"],
    }
  );

export type SignupFormValues = z.infer<typeof signupSchema>;
