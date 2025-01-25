import { useParams } from "react-router-dom";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import useTasks from "../hooks/useTasks";
import { useEffect, useState } from "react";
import type { ICategory } from "../types";
import { Plus } from "lucide-react";
import TaskCard from "../components/TaskCard";
import useCategories from "../hooks/useCategories";
import Loader from "../components/Loader";

interface IProps {
    categoryType?: "allTasks";
}

export default function Category({ categoryType }: IProps) {
    const { categoryName } = useParams();
    const [categoryData, setCategoryData] = useState<ICategory | null>(null);
    const { getCategoryByName } = useCategories();
    const decodedCategoryName = decodeURIComponent(categoryName!);
    const [animationParent] = useAutoAnimate({ duration: 150 });
    const { tasks, createTask, toggleTaskStatus, assignTaskToCategory, deleteTask } = useTasks(
        categoryType === "allTasks" ? undefined : decodedCategoryName
    );

    useEffect(() => {
        if (categoryType === "allTasks") {
            setCategoryData({
                id: "0000",
                name: "All tasks",
                userId: "0000"
            });
            return;
        }

        (async () => {
            const category = await getCategoryByName(decodedCategoryName);
            setCategoryData(category);
        })();
    }, [decodedCategoryName]);

    async function handleCreateTask(): Promise<void> {
        const newTaskName = prompt("Enter new task name");
        if (!newTaskName || !newTaskName.trim()) return;

        const newTask = await createTask(newTaskName.trim());
        if (categoryData && categoryData?.id !== "0000") {
            await assignTaskToCategory(newTask.id, categoryData.id);
        }
    }

    async function handleTaskMark(taskId: string): Promise<void> {
        await toggleTaskStatus(taskId);
    }

    async function handleTaskDelete(taskId: string): Promise<void> {
        await deleteTask(taskId);
    }

    if (!categoryData) {
        return <Loader />;
    }

    return (
        <>
            <h1 className="text-2xl font-bold text-text">
                {categoryType === "allTasks" ? "All tasks" : decodedCategoryName}
            </h1>
            <div className="flex flex-col gap-1" ref={animationParent}>
                {tasks.length ? (
                    tasks.map((task) => (
                        <TaskCard
                            key={task.id}
                            task={task}
                            onTaskMark={handleTaskMark}
                            onTaskDelete={handleTaskDelete}
                        />
                    ))
                ) : (
                    <p className="text-text-dimmed flex justify-center items-center h-36">No tasks yet</p>
                )}
            </div>
            <button
                className="bg-primary text-bold rounded-full p-1 fixed right-1 bottom-1"
                onClick={handleCreateTask}
                title="New task"
                aria-label="Create new task"
            >
                <Plus className="text-text" />
            </button>
        </>
    );
}
