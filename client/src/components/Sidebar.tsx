import { Link, useLocation, useNavigate } from "react-router-dom";
import useCategories from "../hooks/useCategories";
import type { IPopoverItem } from "../types";
import PopoverTrigger from "./PopoverTrigger";
import { LogOut, Trash2, Pencil, UserRoundX, PanelRightOpen, PanelRightClose } from "lucide-react";
import useAuth from "../hooks/useAuth";
import { useState } from "react";
import { m } from "framer-motion";
import { ROUTE_PATHS } from "../routes";
import SidebarItem from "./SidebarItem";
import Button from "./Button";

export default function Sidebar() {
    const location = useLocation();
    const navigate = useNavigate();
    const { categories, createCategory, deleteCategory, renameCategory } = useCategories();
    const { logOut, deleteUser } = useAuth();
    const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

    const iconStrokeWidth = 1.5;

    async function handleRenameCategory(id: string, prevCategoryName: string) {
        const newCategoryName = await renameCategory(id);
        if (!newCategoryName) return;

        if (`${ROUTE_PATHS.CATEGORY}/${encodeURIComponent(prevCategoryName)}` === location.pathname) {
            navigate(`${ROUTE_PATHS.CATEGORY}/${encodeURIComponent(newCategoryName)}`);
        }
    }

    async function handleDeleteCategory(id: string, prevCategoryName: string) {
        deleteCategory(id);

        if (`${ROUTE_PATHS.CATEGORY}/${encodeURIComponent(prevCategoryName)}` === location.pathname) {
            navigate(ROUTE_PATHS.HOME);
        }
    }

    function toggleSidebar() {
        setIsCollapsed((prevIsCollapsed) => !prevIsCollapsed);
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
        <div className="relative overflow-visible">
            <m.nav
                animate={{
                    width: isCollapsed ? 0 : 150,
                    paddingLeft: isCollapsed ? 0 : 8,
                    paddingRight: isCollapsed ? 0 : 8
                }}
                initial={{ width: 150, paddingLeft: 8, paddingRight: 8 }}
                className="flex-none bg-surface-bright h-screen pt-0 shadow-sm overflow-y-auto overflow-x-hidden"
            >
                <div className="flex flex-col">
                    <div className="flex flex-col bg-surface-bright sticky top-0 z-50 mb-2 py-1">
                        <PopoverTrigger items={accountItems}>
                            <Link
                                to={ROUTE_PATHS.HOME}
                                className="text-text text-2xl text-center font-semibold mb-1 rounded-md focus-visible:outline focus-visible:outline-primary"
                            >
                                LightTask
                            </Link>
                        </PopoverTrigger>
                        <Button onClick={createCategory}>New category</Button>
                    </div>
                    <Link
                        to={ROUTE_PATHS.CATEGORY}
                        className={`text-text-dimmed p-1 block w-full rounded truncate focus-visible:outline focus-visible:outline-primary ${getActiveClass(
                            ROUTE_PATHS.CATEGORY
                        )}`}
                        title="All tasks"
                    >
                        All tasks
                    </Link>
                    {categories.map(({ id, name }) => (
                        <SidebarItem
                            key={id}
                            id={id}
                            name={name}
                            createCategoryPopoverItemsFn={createCategoryPopoverItems}
                            getActiveClassFn={getActiveClass}
                        />
                    ))}
                </div>

                <button
                    onClick={toggleSidebar}
                    className="absolute top-0 -right-8 transition-colors hover:bg-white/10 text-text p-1 rounded cursor-pointer"
                    aria-expanded={isCollapsed ? "false" : "true"}
                    aria-label={isCollapsed ? "Show sidebar" : "Hide sidebar"}
                >
                    {isCollapsed ? <PanelRightClose /> : <PanelRightOpen />}
                </button>
            </m.nav>
        </div>
    );
}
