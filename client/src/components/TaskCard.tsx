import { KeyboardEvent, MouseEvent } from "react";
import type { ITask } from "../types";
import { Trash, Circle, CircleCheckBig } from "lucide-react";

interface IProps {
    task: ITask;
    onTaskMark: (taskId: string) => void;
    onTaskDelete: (taskId: string) => void;
}

export default function TaskCard({ task, onTaskMark, onTaskDelete }: IProps) {
    function handleTaskMark(): void {
        onTaskMark(task.id);
    }

    function handleDeleteTask(event: MouseEvent<HTMLButtonElement>): void {
        event.stopPropagation();
        onTaskDelete(task.id);
    }

    function handleKeyDown(event: KeyboardEvent<HTMLDivElement>): void {
        if (event.code === "Enter" || event.code === "Space") {
            handleTaskMark();
        }
    }

    return (
        <div
            className="flex p-2 bg-surface rounded-md shadow-sm w-full justify-between items-center group focus-visible:outline focus-visible:outline-primary"
            onClick={handleTaskMark}
            onKeyDown={handleKeyDown}
            role="button"
            aria-pressed={task.isDone}
            tabIndex={0}
            aria-label={`Mark task: ${task.name}`}
        >
            <div className="flex gap-2 items-center">
                {task.isDone ? <CircleCheckBig className="text-text-dimmed" /> : <Circle className="text-text" />}
                <p
                    className={`${task.isDone ? "text-text-dimmed" : "text-text"} text-left flex-1 ${
                        task.isDone ? "line-through" : ""
                    }`}
                >
                    {task.name}
                </p>
            </div>
            <button
                className="invisible group-hover:visible group-focus-visible:visible text-text"
                onClick={handleDeleteTask}
                tabIndex={-1}
                aria-label={`Delete task: ${task.name}`}
            >
                <Trash className="text-text" />
            </button>
        </div>
    );
}