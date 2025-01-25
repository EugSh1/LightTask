import { useEffect } from "react";
import type { ICategory } from "../types";
import axiosClient from "../utils/axiosClient";
import handleAxiosError from "../utils/handleAxiosError";
import { create } from "zustand";
import { toast } from "react-toastify";

interface IUseCategoriesStore {
    categories: ICategory[];
    set: (newCategories: ICategory[]) => void;
    add: (newCategory: ICategory) => void;
    rename: (id: string, name: string) => void;
    remove: (id: string) => void;
}

const useCategoriesStore = create<IUseCategoriesStore>()((set) => ({
    categories: [],
    set: (newCategories) => set({ categories: newCategories }),
    add: (newCategory) => set((state) => ({ categories: [...state.categories, newCategory] })),
    rename: (id, name) =>
        set((state) => ({
            categories: state.categories.map((category) => (category.id === id ? { ...category, name } : category))
        })),
    remove: (id) => set((state) => ({ categories: state.categories.filter((category) => category.id !== id) }))
}));

export default function useCategories() {
    const categories = useCategoriesStore();

    useEffect(() => {
        (async () => {
            await fetchCategories();
        })();
    }, []);

    async function createCategory(): Promise<void> {
        try {
            const name = prompt("Enter new category name");
            if (!name || !name.trim()) return;

            const { data } = await axiosClient.post("/category", { name });
            categories.add(data);
        } catch (error: unknown) {
            handleAxiosError(error, "Error adding category");
        }
    }

    async function getCategoryByName(name: string): Promise<ICategory> {
        try {
            const { data } = await axiosClient.get(`/category/${name}`);
            return data;
        } catch (error: unknown) {
            handleAxiosError(error, "Error getting category");
            throw new Error("Error getting category");
        }
    }

    async function fetchCategories(): Promise<void> {
        try {
            const { data } = await axiosClient.get("/category");
            categories.set(data);
        } catch (error: unknown) {
            handleAxiosError(error, "Error getting categories");
        }
    }

    async function renameCategory(id: string): Promise<string | undefined> {
        try {
            const name = prompt("Enter new category name");
            if (!name || !name.trim()) return;

            const { data } = await axiosClient.put("/category", { id, name });
            categories.rename(id, name);
            return data.name;
        } catch (error: unknown) {
            handleAxiosError(error, "Error renaming category");
        }
    }

    async function deleteCategory(id: string): Promise<void> {
        try {
            await axiosClient.delete(`/category/${id}`);
            categories.remove(id);
            toast.success("Category deleted");
        } catch (error: unknown) {
            handleAxiosError(error, "Error deleting category");
        }
    }

    return {
        categories: categories.categories,
        getCategoryByName,
        createCategory,
        renameCategory,
        deleteCategory
    } as const;
}
