import z from "zod";

export const loginSchema = z.object({
    email: z.string().email({ message: "Enter a valid email" }),
    password: z.string().min(6, { message: "Minimum 6 characters" }),
});

export type LoginData = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
    name: z.string().min(2, { message: "Enter your name" }),
    username: z.string().min(3, { message: "Username must be at least 3 characters" }),
    email: z.string().email({ message: "Enter a valid email" }),
    password: z.string().min(6, { message: "Minimum 6 characters" }),
    confirmPassword: z.string().min(6, { message: "Minimum 6 characters" }),
}).refine((v) => v.password === v.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
});

export type RegisterData = z.infer<typeof registerSchema>;