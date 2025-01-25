import { z } from "zod";

export const newCategorySchema = z.object({
    name: z
        .string()
        .min(1, "Category name is required")
        .max(24, "Category name must be less than or equal to 24 characters")
});

export const categorySchema = z.object({
    id: z.string().min(1, "Category id is required"),
    name: z
        .string()
        .min(1, "Category name is required")
        .max(24, "Category name must be less than or equal to 24 characters")
});
