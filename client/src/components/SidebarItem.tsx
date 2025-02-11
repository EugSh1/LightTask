import { Link } from "react-router-dom";
import PopoverTrigger from "./PopoverTrigger";
import { ROUTE_PATHS } from "../routes";
import type { IPopoverItem } from "../types";

interface IProps {
    id: string;
    name: string;
    createCategoryPopoverItemsFn: (id: string, name: string) => IPopoverItem[];
    getActiveClassFn: (path: string) => string;
}

const getCategoryPath = (name: string) => `${ROUTE_PATHS.CATEGORY}/${encodeURIComponent(name)}`;

export default function SidebarItem({ id, name, createCategoryPopoverItemsFn, getActiveClassFn }: IProps) {
    return (
        <PopoverTrigger items={createCategoryPopoverItemsFn(id, name)}>
            <Link
                to={getCategoryPath(name)}
                className={`text-text-dimmed p-1 block w-full rounded truncate focus-visible:outline focus-visible:outline-primary ${getActiveClassFn(
                    getCategoryPath(name)
                )}`}
                title={name}
            >
                {name}
            </Link>
        </PopoverTrigger>
    );
}
