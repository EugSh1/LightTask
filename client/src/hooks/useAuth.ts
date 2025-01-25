import { useEffect } from "react";
import axiosClient from "../utils/axiosClient";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import handleAxiosError from "../utils/handleAxiosError";
import { create } from "zustand";

interface IUseAuthStore {
    isAuthenticated: boolean | undefined;
    set: (newValue: boolean) => void;
}

const useAuthStore = create<IUseAuthStore>()((set) => ({
    isAuthenticated: false,
    set: (newValue) => set({ isAuthenticated: newValue })
}));

export default function useAuth() {
    const authState = useAuthStore();
    const navigate = useNavigate();
    const location = useLocation();

    const publicRoutes = ["/login", "/register"];

    useEffect(() => {
        (async () => {
            try {
                await axiosClient.get("/user/check");
                authState.set(true);
            } catch {
                authState.set(false);
                if (!publicRoutes.includes(location.pathname) && !authState.isAuthenticated) {
                    navigate("/login");
                }
            }
        })();
    }, [location.pathname, authState.isAuthenticated, navigate]);

    async function createUser(name: string, password: string): Promise<void> {
        try {
            await axiosClient.post("/user", {
                name,
                password
            });
            toast.success("User successfully created");
            navigate("/login");
        } catch (error: unknown) {
            handleAxiosError(error, "Error creating user");
        }
    }

    async function logIn(name: string, password: string): Promise<void> {
        try {
            const { data } = await axiosClient.post("/user/login", {
                name,
                password
            });
            authState.set(true);
            toast.success(data.message);
            navigate("/");
        } catch (error: unknown) {
            handleAxiosError(error, "Error logging in");
        }
    }

    async function logOut(showConfirmDialog = false): Promise<void> {
        try {
            if (showConfirmDialog && !confirm("Are you sure you want to log out?")) return;
            const { data } = await axiosClient.post("/user/logout");
            authState.set(false);
            toast.success(data.message);
            navigate("/login");
        } catch (error: unknown) {
            handleAxiosError(error, "Error logging out");
        }
    }

    async function deleteUser(): Promise<void> {
        try {
            if (!confirm("Are you sure you want to delete your account?")) return;
            const { data } = await axiosClient.delete("/user");
            toast.success(data.message);
            navigate("/register");
            logOut();
        } catch (error: unknown) {
            handleAxiosError(error, "Error deleting account");
        }
    }

    return { isAuthenticated: authState.isAuthenticated, createUser, logIn, logOut, deleteUser } as const;
}
