import { z } from "zod";

export const userSchema = z.object({
    name: z.string().min(1, "Name is required"),
    password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .max(64, "Password must be less than or equal to 64 characters")
});
