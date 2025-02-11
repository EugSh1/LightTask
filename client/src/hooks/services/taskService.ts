import { ITask } from "../../types";
import axiosClient from "../../utils/axiosClient";

interface ICreateTask {
    newTask: Pick<ITask, "name">;
    categoryId: string;
}

export default class TaskService {
    static async createTask({ newTask, categoryId }: ICreateTask) {
        const { data } = await axiosClient.post<ITask>("/task", newTask);
        if (categoryId !== "all-tasks") {
            await axiosClient.put(`/task/assign`, { taskId: data.id, categoryId });
        }
        return null;
    }

    static async deleteTask(taskId: Pick<ITask, "id">) {
        return await axiosClient.delete<ITask>(`/task/${taskId.id}`);
    }

    static async getTasks(categoryName: string) {
        const { data } = await axiosClient.get<ITask[]>(categoryName ? `/task/?categoryName=${categoryName}` : "/task");
        return data;
    }

    static async toggleTaskStatus(taskId: Pick<ITask, "id">) {
        return await axiosClient.put<ITask>("/task/status", taskId);
    }
}
