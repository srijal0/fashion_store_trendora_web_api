import { z } from "zod";

// Profile Update Schema
export const profileSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email address"),
  bio: z
    .string()
    .max(500, "Bio must be less than 500 characters")
    .optional(),
  phone: z
    .string()
    .regex(/^[0-9]{10}$/, "Phone number must be 10 digits")
    .optional()
    .or(z.literal("")),
  image: z
    .instanceof(File)
    .refine((file) => file.size <= 5 * 1024 * 1024, "Image must be less than 5MB")
    .refine(
      (file) => ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"].includes(file.type),
      "Only JPG, PNG, GIF, and WebP formats are allowed"
    )
    .optional()
    .or(z.literal(null)),
});

// TypeScript type for form data
export type ProfileData = z.infer<typeof profileSchema>;

// Type for API response
export interface ProfileUpdateResponse {
  success: boolean;
  message?: string;
  data?: {
    id: string;
    name: string;
    email: string;
    bio?: string;
    phone?: string;
    image?: string;
  };
}