import { PrismaClient, Category } from "@prisma/client";
import HTTPError from "../httpError.js";
import { handleServiceError } from "../utils/errorUtils.js";
const prisma = new PrismaClient();

export default class CategoryService {
    static async getCategories(userId: string): Promise<Category[]> {
        try {
            return await prisma.category.findMany({
                where: { userId }
            });
        } catch (error: unknown) {
            handleServiceError(error, "Error getting categories");
        }
    }

    static async getCategory(name: string, userId: string): Promise<Category> {
        try {
            const category = await prisma.category.findFirst({
                where: { name, userId }
            });

            if (!category) {
                throw new HTTPError("Category not found", 404);
            }

            return category;
        } catch (error: unknown) {
            handleServiceError(error, "Error getting category");
        }
    }

    static async createCategory(
        { name }: Pick<Category, "name">,
        userId: string
    ): Promise<Category> {
        try {
            if (await this.checkIfCategoryExists({ name, userId })) {
                throw new HTTPError("A category with this name already exists", 400);
            }

            return await prisma.category.create({
                data: {
                    name,
                    userId
                }
            });
        } catch (error: unknown) {
            handleServiceError(error, "Error creating category");
        }
    }

    static async updateCategory(
        id: string,
        { name }: Pick<Category, "name">,
        userId: string
    ): Promise<Category> {
        try {
            if (await this.checkIfCategoryExists({ name, userId })) {
                throw new HTTPError("A category with this name already exists", 400);
            }

            return await prisma.category.update({
                where: { id, userId },
                data: { name }
            });
        } catch (error: unknown) {
            handleServiceError(error, "Error updating category");
        }
    }

    static async deleteCategory(id: string, userId: string): Promise<void> {
        try {
            await prisma.category.delete({
                where: { id, userId }
            });
        } catch (error: unknown) {
            handleServiceError(error, "Error deleting category");
        }
    }

    static async checkIfCategoryExists({
        name,
        userId
    }: Pick<Category, "name"> & { userId: string }) {
        const category = await prisma.category.findFirst({
            where: {
                name,
                userId
            }
        });

        return !!category;
    }
}
