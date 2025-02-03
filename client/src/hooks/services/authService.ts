import { IUser } from "../../types";
import axiosClient from "../../utils/axiosClient";

export default class AuthService {
    static async createUser(newUser: Omit<IUser, "id">) {
        return await axiosClient.post<null>("/user", newUser);
    }

    static async deleteUser() {
        const { data } = await axiosClient.delete<{ message: string }>("/user");
        return data;
    }

    static async getIsAuth() {
        try {
            await axiosClient.get<null>("/user/check");
            return true;
        } catch {
            return false;
        }
    }

    static async logIn(user: Omit<IUser, "id">) {
        const { data } = await axiosClient.post<{ message: string }>("/user/login", user);
        return data;
    }

    static async logOut() {
        const { data } = await axiosClient.post<{ message: string }>("/user/logout");
        return data;
    }
}
