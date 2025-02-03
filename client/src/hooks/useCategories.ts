import handleAxiosError from "../utils/handleAxiosError";
import { toast } from "react-toastify";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import CategoryService from "./services/categoryService";

export default function useCategories() {
    const queryClient = useQueryClient();

    const { data: categories } = useQuery({
        queryKey: ["categories"],
        queryFn: CategoryService.getCategories,
        initialData: []
    });

    async function getCategoryByName(name: string) {
        if (!name.trim()) return null;

        try {
            const category = await queryClient.fetchQuery({
                queryKey: ["category", name],
                queryFn: () => CategoryService.getCategoryByName({ name })
            });
            return category;
        } catch (error) {
            handleAxiosError(error, "Error fetching category");
            return null;
        }
    }

    const { mutate: createCategory } = useMutation({
        mutationFn: CategoryService.createCategory,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["categories"] });
        },
        onError: (error) => {
            handleAxiosError(error, "Error creating category");
        }
    });

    const { mutateAsync: renameCategory } = useMutation({
        mutationFn: CategoryService.renameCategory,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["categories"] });
        },
        onError: (error) => {
            handleAxiosError(error, "Error renaming category");
        }
    });

    const { mutate: deleteCategory } = useMutation({
        mutationFn: CategoryService.deleteCategory,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["categories"] });
        },
        onError: (error) => {
            handleAxiosError(error, "Error deleting category");
        }
    });

    function handleCreateCategory() {
        const name = prompt("Enter new category name");
        if (!name || !name.trim()) return;
        createCategory({ name });
    }

    async function handleRenameCategory(id: string) {
        const name = prompt("Enter new category name");
        if (!name || !name.trim()) return;
        const { name: newCategoryName } = await renameCategory({ id, name });
        return newCategoryName;
    }

    function handleDeleteCategory(id: string) {
        if (!confirm("Are you sure you want to delete the category?")) return;
        deleteCategory({ id });
        toast.success("Category deleted");
    }

    return {
        categories,
        getCategoryByName,
        createCategory: handleCreateCategory,
        renameCategory: handleRenameCategory,
        deleteCategory: handleDeleteCategory
    } as const;
}
