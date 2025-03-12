import { z } from "zod";

export const profileBasicSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
});

export type ProfileBasicInput = z.infer<typeof profileBasicSchema>;

export const profilePasswordSchema = z
  .object({
    currentPassword: z.string().min(6, "At least 6 characters"),
    newPassword: z.string().min(6, "At least 6 characters"),
    confirmNewPassword: z.string().min(6, "At least 6 characters"),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "New passwords do not match",
    path: ["confirmNewPassword"],
  });

export type ProfilePasswordInput = z.infer<typeof profilePasswordSchema>;
