import { ReactNode } from "react";

export interface ITask {
    id: string;
    name: string;
    isDone: boolean;
    userId: string;
}

export interface ICategory {
    id: string;
    name: string;
    userId: string;
}

export interface IPopoverItem {
    title: string;
    action: () => void;
    icon?: ReactNode;
}

export interface IHomeCardButton {
    title: string;
    action: () => void;
}
