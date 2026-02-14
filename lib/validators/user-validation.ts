import { z } from "zod";

export const userSchema = z
  .object({
    name: z.string().min(4, "Name is too short."),
    username: z.string().min(4, "Username is too short."),
    email: z.string().email("Invalid Email"),
    password: z.string().min(6, "Password must be more than 6 characters."),
    phoneNumber: z.string().min(10, "Insert a valid phonenumber."),
    country: z.string(),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type userInput = z.infer<typeof userSchema>;
