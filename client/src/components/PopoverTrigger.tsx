import { MouseEvent, ReactNode, useState, useRef } from "react";
import type { IPopoverItem } from "../types";
import Popover from "./Popover";

interface IProps {
    items: IPopoverItem[];
    children: ReactNode;
}

export default function PopoverTrigger({ items, children }: IProps) {
    const [isVisible, setIsVisible] = useState<boolean>(false);
    const triggerRef = useRef<HTMLDivElement | null>(null);

    function showPopover(event: MouseEvent<HTMLDivElement>) {
        event.preventDefault();
        setIsVisible(true);
    }

    function hidePopover() {
        setIsVisible(false);
    }

    return (
        <>
            <div ref={triggerRef} onContextMenu={showPopover} className="relative">
                {children}
            </div>
            {isVisible && <Popover items={items} closeFn={hidePopover} triggerRef={triggerRef} />}
        </>
    );
}
