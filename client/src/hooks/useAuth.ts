import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import AuthService from "./services/authService";
import { toast } from "react-toastify";
import handleAxiosError from "../utils/handleAxiosError";
import { PUBLIC_ROUTES, ROUTE_PATHS } from "../routes";

export default function useAuth() {
    const navigate = useNavigate();
    const location = useLocation();
    const queryClient = useQueryClient();

    const { data: isAuthenticated, isLoading } = useQuery({
        queryKey: ["auth"],
        queryFn: AuthService.getIsAuth
    });

    const { mutate: createUser } = useMutation({
        mutationFn: AuthService.createUser,
        onSuccess: () => {
            toast.success("User successfully created");
            navigate(ROUTE_PATHS.LOGIN);
        },
        onError: (error) => {
            handleAxiosError(error, "Error creating user");
        }
    });

    const { mutate: deleteUser } = useMutation({
        mutationFn: AuthService.deleteUser,
        onSuccess: (data) => {
            toast.success(data.message);
        },
        onError: (error) => {
            handleAxiosError(error, "Error deleting account");
        }
    });

    const { mutate: logIn } = useMutation({
        mutationFn: AuthService.logIn,
        onSuccess: async (data) => {
            toast.success(data.message);
            await queryClient.invalidateQueries({ queryKey: ["auth"] });
            navigate(ROUTE_PATHS.HOME);
        },
        onError: (error) => {
            handleAxiosError(error, "Error logging in");
        }
    });

    const { mutate: logOut } = useMutation({
        mutationFn: AuthService.logOut,
        onSuccess: (data) => {
            toast.success(data.message);
            queryClient.invalidateQueries({ queryKey: ["auth"] });
        },
        onError: (error) => {
            handleAxiosError(error, "Error logging out");
        }
    });

    useEffect(() => {
        if (isLoading) return;
        if (!PUBLIC_ROUTES.some((route) => route === location.pathname) && !isAuthenticated) {
            navigate(ROUTE_PATHS.LOGIN);
        }
    }, [location.pathname, navigate, isAuthenticated]);

    function handleLogOut(showConfirmDialog = false) {
        if (showConfirmDialog && !confirm("Are you sure you want to log out?")) return;
        logOut();
    }

    function handleDeleteUser() {
        if (!confirm("Are you sure you want to delete your account?")) return;
        deleteUser();
        logOut();
    }

    return {
        isAuthenticated: isLoading ? undefined : isAuthenticated,
        createUser,
        logIn,
        logOut: handleLogOut,
        deleteUser: handleDeleteUser
    } as const;
}
