import { MouseEvent, useEffect } from "react";
import { createPortal } from "react-dom";
import type { IPopoverItem } from "../types";

interface Popup {
    items: IPopoverItem[];
    closeFn: () => void;
    triggerRef: React.RefObject<HTMLDivElement>;
}

export default function Popover({ items, closeFn, triggerRef }: Popup) {
    useEffect(() => {
        function handleKeyDown(event: KeyboardEvent) {
            if (event.key === "Escape") {
                closeFn();
            }
        }
        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    function handleItemClick(action: () => void): void {
        action();
        closeFn();
    }

    const triggerRect = triggerRef.current?.getBoundingClientRect();
    const popoverPosition = triggerRect
        ? {
              top: triggerRect.top + window.scrollY,
              left: triggerRect.left + window.scrollX
          }
        : { top: 0, left: 0 };

    return createPortal(
        <div
            className="w-screen h-screen bg-surface/20 fixed top-0 left-0 flex justify-center items-center z-50"
            onClick={closeFn}
        >
            <div
                role="dialog"
                className="bg-surface-bright rounded-md shadow-md p-1 absolute flex flex-col"
                style={{
                    top: `${popoverPosition.top}px`,
                    left: `${popoverPosition.left}px`
                }}
                onClick={(event: MouseEvent<HTMLDivElement>) => event.stopPropagation()}
            >
                {items.map(({ title, action, icon }, index) => (
                    <button
                        key={index}
                        onClick={() => handleItemClick(action)}
                        className="text-text p-1 rounded hover:bg-surface flex gap-1"
                    >
                        {icon || ""}
                        {title}
                    </button>
                ))}
            </div>
        </div>,
        document.body
    );
}
