import { useEffect } from "react";
import type { ITask } from "../types";
import axiosClient from "../utils/axiosClient";
import { toast } from "react-toastify";
import handleAxiosError from "../utils/handleAxiosError";
import { create } from "zustand";

interface IUseTasksStore {
    tasks: ITask[];
    set: (newTasks: ITask[]) => void;
    add: (newTask: ITask) => void;
    toggle: (id: string, updatedTask: ITask) => void;
    remove: (id: string) => void;
}

const useTasksStore = create<IUseTasksStore>()((set) => ({
    tasks: [],
    set: (newTasks) => set({ tasks: newTasks }),
    add: (newTask) => set((state) => ({ tasks: [...state.tasks, newTask] })),
    toggle: (id, updatedTask) =>
        set((state) => ({
            tasks: state.tasks.map((task) => (task.id === id ? updatedTask : task))
        })),
    remove: (id) => set((state) => ({ tasks: state.tasks.filter((task) => task.id !== id) }))
}));

export default function useTasks(categoryName?: string) {
    const tasks = useTasksStore();

    useEffect(() => {
        (async () => {
            await fetchTasks();
        })();
    }, [categoryName]);

    async function fetchTasks(): Promise<void> {
        try {
            const { data } = await axiosClient.get(categoryName ? `/task/?categoryName=${categoryName}` : "/task");
            tasks.set(data);
        } catch (error: unknown) {
            handleAxiosError(error, "Error fetching tasks");
            tasks.set([]);
        }
    }

    async function createTask(name: string): Promise<ITask> {
        try {
            const { data } = await axiosClient.post("/task", { name });
            tasks.add(data);
            return data;
        } catch (error: unknown) {
            handleAxiosError(error, "Error adding task");
            throw new Error("Error adding task");
        }
    }

    async function toggleTaskStatus(id: string) {
        try {
            const { data } = await axiosClient.put(`/task/status`, { id });
            tasks.toggle(id, data);
        } catch (error: unknown) {
            handleAxiosError(error, "Error updating task");
        }
    }

    async function deleteTask(id: string): Promise<void> {
        try {
            await axiosClient.delete(`/task/${id}`);
            tasks.remove(id);
            toast.success("Task deleted");
        } catch (error: unknown) {
            handleAxiosError(error, "Error deleting task");
        }
    }

    async function assignTaskToCategory(taskId: string, categoryId: string): Promise<void> {
        try {
            await axiosClient.put(`/task/assign`, { taskId, categoryId });
            fetchTasks();
        } catch (error: unknown) {
            handleAxiosError(error, "Error assigning task");
        }
    }

    async function unassignTaskFromCategory(taskId: string, categoryId: string): Promise<void> {
        try {
            await axiosClient.put(`/task/unassign`, { taskId, categoryId });
            fetchTasks();
        } catch (error: unknown) {
            handleAxiosError(error, "Error unassigning task");
        }
    }

    return {
        tasks: tasks.tasks,
        createTask,
        toggleTaskStatus,
        deleteTask,
        assignTaskToCategory,
        unassignTaskFromCategory
    } as const;
}
