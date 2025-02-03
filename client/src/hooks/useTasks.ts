import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import TaskService from "./services/taskService";
import handleAxiosError from "../utils/handleAxiosError";
import { toast } from "react-toastify";

export default function useTasks(categoryName?: string) {
    const queryClient = useQueryClient();

    const { data: tasks } = useQuery({
        queryKey: ["tasks", categoryName],
        queryFn: ({ queryKey }) => TaskService.getTasks(queryKey[1] as string),
        initialData: []
    });

    const { mutate: createTask } = useMutation({
        mutationFn: TaskService.createTask,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tasks", categoryName] });
        },
        onError: (error) => {
            handleAxiosError(error, "Error creating task");
        }
    });

    const { mutate: toggleTaskStatus } = useMutation({
        mutationFn: TaskService.toggleTaskStatus,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tasks", categoryName] });
        },
        onError: (error) => {
            handleAxiosError(error, "Error updating task");
        }
    });

    const { mutate: deleteTask } = useMutation({
        mutationFn: TaskService.deleteTask,
        onSuccess: () => {
            toast.success("Task deleted");
            queryClient.invalidateQueries({ queryKey: ["tasks", categoryName] });
        },
        onError: (error) => {
            handleAxiosError(error, "Error deleting task");
        }
    });

    return {
        tasks,
        createTask,
        toggleTaskStatus,
        deleteTask
    } as const;
}
