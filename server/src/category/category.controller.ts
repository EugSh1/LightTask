import { Request, Response } from "express";
import CategoryService from "./category.service.js";
import { catchErrors } from "../utils/errorUtils.js";
import { categorySchema, newCategorySchema } from "./category.schema.js";

export default class CategoryController {
    public static async getCategories(req: Request, res: Response): Promise<void> {
        catchErrors(res, async () => {
            const userId = req?.userId as string;

            const categories = await CategoryService.getCategories(userId);
            res.status(200).json(categories);
        });
    }

    public static async getCategory(req: Request, res: Response): Promise<void> {
        catchErrors(res, async () => {
            const userId = req?.userId as string;
            const name = req.params.name;

            const category = await CategoryService.getCategory(name, userId);
            res.status(200).json(category);
        });
    }

    public static async createCategory(req: Request, res: Response): Promise<void> {
        catchErrors(res, async () => {
            const userId = req?.userId as string;
            const parsedBody = newCategorySchema.parse(req.body);
            const { name } = parsedBody;

            const newCategory = await CategoryService.createCategory({ name }, userId);
            res.status(201).json(newCategory);
        });
    }

    public static async updateCategory(req: Request, res: Response): Promise<void> {
        catchErrors(res, async () => {
            const userId = req?.userId as string;
            const parsedBody = categorySchema.parse(req.body);
            const { id, name } = parsedBody;

            const updatedCategory = await CategoryService.updateCategory(id, { name }, userId);
            res.status(200).json(updatedCategory);
        });
    }

    public static async deleteCategory(req: Request, res: Response): Promise<void> {
        catchErrors(res, async () => {
            const userId = req?.userId as string;
            const id = req?.params.id;

            await CategoryService.deleteCategory(id, userId);
            res.sendStatus(200);
        });
    }
}
