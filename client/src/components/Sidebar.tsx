import { Link, useLocation, useNavigate } from "react-router-dom";
import useCategories from "../hooks/useCategories";
import type { IPopoverItem } from "../types";
import PopoverTrigger from "./PopoverTrigger";
import { LogOut, Trash2, Pencil, UserRoundX } from "lucide-react";
import useAuth from "../hooks/useAuth";

export default function Sidebar() {
    const location = useLocation();
    const navigate = useNavigate();
    const { categories, createCategory, deleteCategory, renameCategory } = useCategories();
    const { logOut, deleteUser } = useAuth();

    const iconStrokeWidth = 1.5;

    async function handleRenameCategory(id: string, prevCategoryName: string): Promise<void> {
        const newCategoryName = await renameCategory(id);
        if (!newCategoryName) return;

        if (`/category/${encodeURIComponent(prevCategoryName)}` === location.pathname) {
            navigate(`/category/${encodeURIComponent(newCategoryName)}`);
        }
    }

    async function handleDeleteCategory(id: string, prevCategoryName: string): Promise<void> {
        await deleteCategory(id);

        if (`/category/${encodeURIComponent(prevCategoryName)}` === location.pathname) {
            navigate("/");
        }
    }

    function createCategoryPopoverItems(id: string, name: string): IPopoverItem[] {
        return [
            {
                title: "Rename",
                action: () => handleRenameCategory(id, name),
                icon: <Pencil strokeWidth={iconStrokeWidth} />
            },
            {
                title: "Delete",
                action: () => handleDeleteCategory(id, name),
                icon: <Trash2 strokeWidth={iconStrokeWidth} />
            }
        ];
    }

    const accountItems: IPopoverItem[] = [
        { title: "Log out", action: logOut, icon: <LogOut strokeWidth={iconStrokeWidth} /> },
        { title: "Delete account", action: deleteUser, icon: <UserRoundX strokeWidth={iconStrokeWidth} /> }
    ];

    const getActiveClass = (path: string) => (location.pathname === path ? "bg-surface" : "");

    return (
        <nav className="flex-none bg-surface-bright h-screen p-2 pt-0 shadow-sm overflow-y-auto overflow-x-hidden">
            <div className="flex flex-col w-36 pt-2">
                <div className="flex flex-col bg-surface-bright sticky top-0 z-50 mb-2">
                    <PopoverTrigger items={accountItems}>
                        <Link
                            to="/"
                            className="text-text text-2xl text-center font-semibold mb-1 rounded-md focus-visible:outline focus-visible:outline-primary"
                        >
                            LightTask
                        </Link>
                    </PopoverTrigger>
                    <button className="bg-primary rounded-md p-1 text-text font-semibold" onClick={createCategory}>
                        New category
                    </button>
                </div>
                <Link
                    to={"/category"}
                    className={`text-text-dimmed p-1 block w-full rounded truncate focus-visible:outline focus-visible:outline-primary ${getActiveClass(
                        "/category"
                    )}`}
                    title="All tasks"
                >
                    All tasks
                </Link>
                {categories.map(({ id, name }) => (
                    <PopoverTrigger key={name} items={createCategoryPopoverItems(id, name)}>
                        <Link
                            to={`/category/${encodeURIComponent(name)}`}
                            className={`text-text-dimmed p-1 block w-full rounded truncate focus-visible:outline focus-visible:outline-primary ${getActiveClass(
                                `/category/${encodeURIComponent(name)}`
                            )}`}
                            title={name}
                        >
                            {name}
                        </Link>
                    </PopoverTrigger>
                ))}
            </div>
        </nav>
    );
}
