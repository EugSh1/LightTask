import { z } from "zod";

export const newTaskSchema = z.object({
    name: z.string().min(1, "Task name is required").max(128, "Task name must be less than or equal to 128 characters")
});

export const taskIdSchema = z.object({
    id: z.string().min(1, "Task id is required")
});

export const assignTaskSchema = z.object({
    taskId: z.string().min(1, "Task id is required"),
    categoryId: z.string().min(1, "Category id is required")
});
