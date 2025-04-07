import { PrismaClient, Task } from "@prisma/client";
import HTTPError from "../httpError.js";
import { handleServiceError } from "../utils/errorUtils.js";
const prisma = new PrismaClient();

export default class TaskService {
    static async getAllTasks(userId: string): Promise<Task[]> {
        try {
            return await prisma.task.findMany({
                where: { userId }
            });
        } catch (error: unknown) {
            handleServiceError(error, "Error getting tasks");
        }
    }

    static async getTasksByCategoryName(categoryName: string, userId: string): Promise<Task[]> {
        try {
            return await prisma.task.findMany({
                where: {
                    categories: {
                        some: {
                            name: categoryName,
                            userId
                        }
                    }
                }
            });
        } catch (error: unknown) {
            handleServiceError(error, "Error getting tasks");
        }
    }

    static async createTask(task: Pick<Task, "name">, userId: string): Promise<Task> {
        try {
            return await prisma.task.create({
                data: {
                    name: task.name,
                    userId
                }
            });
        } catch (error: unknown) {
            handleServiceError(error, "Error creating task");
        }
    }

    static async toggleTaskStatus(id: string, userId: string): Promise<Task> {
        try {
            const task = await prisma.task.findUnique({ where: { id, userId } });

            if (!task) throw new HTTPError("Task not found", 404);

            return await prisma.task.update({
                where: { id, userId },
                data: { isDone: !task.isDone }
            });
        } catch (error: unknown) {
            handleServiceError(error, "Error toggling task state");
        }
    }

    static async deleteTask(id: string, userId: string): Promise<void> {
        try {
            await prisma.task.delete({
                where: { id, userId }
            });
        } catch (error: unknown) {
            handleServiceError(error, "Error deleting task");
        }
    }

    static async assignTaskToCategory(
        taskId: string,
        categoryId: string,
        userId: string
    ): Promise<void> {
        try {
            const category = await prisma.category.findFirst({
                where: { id: categoryId, userId }
            });

            if (!category) {
                throw new HTTPError("Category not found or does not belong to the user", 404);
            }

            await prisma.task.update({
                where: { id: taskId, userId },
                data: {
                    categories: {
                        connect: { id: categoryId }
                    }
                }
            });
        } catch (error: unknown) {
            handleServiceError(error, "Error when assigning a task to a category");
        }
    }

    static async unassignTaskFromCategory(
        taskId: string,
        categoryId: string,
        userId: string
    ): Promise<void> {
        try {
            const category = await prisma.category.findFirst({
                where: { id: categoryId, userId }
            });

            if (!category) {
                throw new HTTPError("Category not found or does not belong to the user", 404);
            }

            await prisma.task.update({
                where: { id: taskId, userId },
                data: {
                    categories: {
                        disconnect: { id: categoryId }
                    }
                }
            });
        } catch (error: unknown) {
            handleServiceError(error, "Error when unassigning a task from a category");
        }
    }
}
