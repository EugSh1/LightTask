import { ChangeEvent, MouseEvent, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ICategory } from "../types";
import { useNavigate } from "react-router-dom";
import useCategories from "../hooks/useCategories";
import { AnimatePresence, m } from "framer-motion";

export default function SearchPalette() {
    const [isVisible, setIsVisible] = useState<boolean>(false);
    const [filter, setFilter] = useState<string>("");
    const [filteredCategories, setFilteredCategories] = useState<ICategory[]>([]);
    const filterInputRef = useRef<HTMLInputElement | null>(null);
    const { categories } = useCategories();
    const navigate = useNavigate();

    useEffect(() => {
        setFilteredCategories(
            categories.filter((category) => category.name.toLowerCase().includes(filter.toLowerCase()))
        );
    }, [categories, filter]);

    useEffect(() => {
        function handleKeyDown(event: KeyboardEvent) {
            if (event.code === "Escape") {
                closeSearchPalette();
            } else if ((event.ctrlKey || event.metaKey) && event.code === "KeyK") {
                setIsVisible((prevIsVisible) => !prevIsVisible);
            }
        }
        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    useEffect(() => {
        if (isVisible) filterInputRef.current?.focus();
    }, [isVisible]);

    function closeSearchPalette(): void {
        setIsVisible(false);
        setFilter("");
    }

    function handleCategoryClick(name: string): void {
        navigate(`/category/${encodeURIComponent(name)}`);
        closeSearchPalette();
    }

    return createPortal(
        <AnimatePresence>
            {isVisible && (
                <m.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="w-screen h-screen bg-surface/20 fixed flex top-0 justify-center items-center z-50"
                    onClick={closeSearchPalette}
                >
                    <m.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ type: "spring", duration: 0.2 }}
                        className="bg-surface-bright rounded-md shadow-md p-1 w-2/4 flex flex-col"
                        onClick={(event: MouseEvent<HTMLDivElement>) => event.stopPropagation()}
                    >
                        <input
                            type="text"
                            placeholder="Type to search"
                            ref={filterInputRef}
                            className="bg-surface p-2 focus-visible:outline outline-primary placeholder:text-text-dimmed text-text rounded-md mb-1"
                            value={filter}
                            onChange={(event: ChangeEvent<HTMLInputElement>) => setFilter(event.target.value)}
                        />
                        <div className="flex flex-col max-h-[45vh] overflow-y-auto">
                            {filteredCategories.length ? (
                                filteredCategories.map(({ id, name }) => (
                                    <button
                                        key={id}
                                        onClick={() => handleCategoryClick(name)}
                                        className="text-text p-2 rounded-md hover:bg-surface/40 focus-visible:bg-surface/70 outline-none flex gap-1 truncate min-h-fit"
                                        title={name}
                                    >
                                        {name}
                                    </button>
                                ))
                            ) : (
                                <p className="text-text-dimmed flex justify-center items-center h-10">
                                    No categories found
                                </p>
                            )}
                        </div>
                    </m.div>
                </m.div>
            )}
        </AnimatePresence>,
        document.body
    );
}
