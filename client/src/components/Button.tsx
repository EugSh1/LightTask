import clsx from "clsx";
import { ButtonHTMLAttributes } from "react";

export default function Button({
    className,
    children,
    ...props
}: Readonly<ButtonHTMLAttributes<HTMLButtonElement>>) {
    return (
        <button
            className={clsx("bg-primary text-text font-semibold p-1 rounded-md", className)}
            {...props}
        >
            {children}
        </button>
    );
}
