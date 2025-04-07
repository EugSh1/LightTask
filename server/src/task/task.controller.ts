import { Request, Response } from "express";
import TaskService from "./task.service.js";
import { catchErrors } from "../utils/errorUtils.js";
import { assignTaskSchema, newTaskSchema, taskIdSchema } from "./task.schema.js";
import HTTPError from "../httpError.js";

export default class TaskController {
    static async getTasks(req: Request, res: Response): Promise<void> {
        catchErrors(res, async () => {
            const userId = req?.userId as string;
            const categoryName = req.query.categoryName as string;

            let tasks;
            if (categoryName) {
                tasks = await TaskService.getTasksByCategoryName(categoryName, userId);
            } else {
                tasks = await TaskService.getAllTasks(userId);
            }
            res.status(200).json(tasks);
        });
    }

    static async createTask(req: Request, res: Response): Promise<void> {
        catchErrors(res, async () => {
            const userId = req?.userId as string;
            const parsedBody = newTaskSchema.parse(req.body);
            const { name } = parsedBody;

            const newTask = await TaskService.createTask({ name }, userId);
            res.status(201).json(newTask);
        });
    }

    static async toggleTaskStatus(req: Request, res: Response): Promise<void> {
        catchErrors(res, async () => {
            const userId = req?.userId as string;
            const parsedBody = taskIdSchema.parse(req.body);
            const { id } = parsedBody;

            const updatedTask = await TaskService.toggleTaskStatus(id, userId);
            res.status(200).json(updatedTask);
        });
    }

    static async deleteTask(req: Request, res: Response): Promise<void> {
        catchErrors(res, async () => {
            const userId = req?.userId as string;
            const id = req?.params.id;

            if (!id || !id.trim()) {
                throw new HTTPError("The task id cannot be empty", 400);
            }

            await TaskService.deleteTask(id, userId);
            res.sendStatus(200);
        });
    }

    static async assignTaskToCategory(req: Request, res: Response): Promise<void> {
        catchErrors(res, async () => {
            const userId = req?.userId as string;
            const parsedBody = assignTaskSchema.parse(req.body);
            const { taskId, categoryId } = parsedBody;

            await TaskService.assignTaskToCategory(taskId, categoryId, userId);
            res.sendStatus(200);
        });
    }

    static async unassignTaskFromCategory(req: Request, res: Response): Promise<void> {
        catchErrors(res, async () => {
            const userId = req?.userId as string;
            const parsedBody = assignTaskSchema.parse(req.body);
            const { taskId, categoryId } = parsedBody;

            await TaskService.unassignTaskFromCategory(taskId, categoryId, userId);
            res.sendStatus(200);
        });
    }
}
