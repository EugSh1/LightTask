import { ICategory } from "../../types";
import axiosClient from "../../utils/axiosClient";

export default class CategoryService {
    static async createCategory(newCategory: Pick<ICategory, "name">) {
        await axiosClient.post<ICategory>("/category", newCategory);
    }

    static async getCategories() {
        const { data } = await axiosClient.get<ICategory[]>("/category");
        return data;
    }

    static async getCategoryByName({ name }: Pick<ICategory, "name">) {
        const { data } = await axiosClient.get<ICategory>(`/category/${name}`);
        return data;
    }

    static async renameCategory(newCategoryData: Pick<ICategory, "id" | "name">) {
        const { data } = await axiosClient.put<ICategory>("/category", newCategoryData);
        return data;
    }

    static async deleteCategory({ id }: Pick<ICategory, "id">) {
        return await axiosClient.delete(`/category/${id}`);
    }
}
