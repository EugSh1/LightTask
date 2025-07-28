import { useParams } from "react-router-dom";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import useTasks from "../hooks/useTasks";
import useCategories from "../hooks/useCategories";
import { useCallback, useEffect, useState } from "react";
import type { ICategory } from "../types";
import { Plus } from "lucide-react";
import TaskCard from "../components/TaskCard";
import Loader from "../components/Loader";

interface IProps {
    categoryType?: "allTasks";
}

const allTasksCategory: ICategory = {
    id: "all-tasks",
    name: "All tasks",
    userId: "all-tasks"
};

export default function Category({ categoryType }: Readonly<IProps>) {
    const { categoryName } = useParams();
    const [categoryData, setCategoryData] = useState<ICategory | null>(null);
    const { getCategoryByName } = useCategories();
    const decodedCategoryName = categoryName ? decodeURIComponent(categoryName) : "";
    const [animationParent] = useAutoAnimate({ duration: 150 });
    const { tasks, createTask, toggleTaskStatus, deleteTask } = useTasks(
        categoryType === "allTasks" ? undefined : decodedCategoryName
    );

    useEffect(() => {
        if (categoryType === "allTasks") {
            setCategoryData(allTasksCategory);
            return;
        }

        (async () => {
            const category = await getCategoryByName(decodedCategoryName);
            setCategoryData(category);
        })();
    }, [decodedCategoryName]);

    async function handleCreateTask() {
        const newTaskName = prompt("Enter new task name");
        if (!newTaskName?.trim() || !categoryData) return;

        createTask({
            newTask: { name: newTaskName.trim() },
            categoryId: categoryData.id
        });
    }

    const handleTaskMark = useCallback(
        (id: string) => toggleTaskStatus({ id }),
        [toggleTaskStatus]
    );
    const handleTaskDelete = useCallback((id: string) => deleteTask({ id }), [deleteTask]);

    if (!categoryData) {
        return <Loader />;
    }

    return (
        <main className="px-6">
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
                    <p className="text-text-dimmed flex justify-center items-center h-36">
                        No tasks yet
                    </p>
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
        </main>
    );
}
