import Home from "./pages/Home";
import LogIn from "./pages/LogIn";
import Category from "./pages/Category";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import { IRoute } from "./types";

export const ROUTE_PATHS = {
    HOME: "/",
    CATEGORY: "/category",
    CATEGORY_DYNAMIC: "/category/:categoryName",
    REGISTER: "/register",
    LOGIN: "/login",
    NOT_FOUND: "*"
} as const;

export const PUBLIC_ROUTES = [ROUTE_PATHS.LOGIN, ROUTE_PATHS.REGISTER] as const;

export const routes: IRoute[] = [
    { path: ROUTE_PATHS.HOME, element: <Home /> },
    { path: ROUTE_PATHS.CATEGORY, element: <Category categoryType="allTasks" /> },
    { path: ROUTE_PATHS.CATEGORY_DYNAMIC, element: <Category /> },
    { path: ROUTE_PATHS.REGISTER, element: <Register /> },
    { path: ROUTE_PATHS.LOGIN, element: <LogIn /> },
    { path: ROUTE_PATHS.NOT_FOUND, element: <NotFound /> }
] as const;
