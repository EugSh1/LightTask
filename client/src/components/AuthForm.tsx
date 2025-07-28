import { FormEvent, ReactNode, useEffect, useRef } from "react";
import Button from "./Button";

interface IProps {
    title: string;
    altLink: ReactNode;
    onSubmit: (name: string, password: string) => void;
}

export default function AuthForm({ title, altLink, onSubmit }: Readonly<IProps>) {
    const nameInputRef = useRef<HTMLInputElement>(null);
    const passwordInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        nameInputRef.current?.focus();
    }, []);

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (!nameInputRef.current || !passwordInputRef.current) return;

        const name = nameInputRef.current.value;
        const password = passwordInputRef.current.value;

        onSubmit(name, password);
        nameInputRef.current.focus();
        nameInputRef.current.value = "";
        passwordInputRef.current.value = "";
    }

    return (
        <main className="flex justify-center items-center h-screen">
            <form
                className="flex flex-col gap-1 bg-surface border border-border rounded-md p-2"
                onSubmit={handleSubmit}
            >
                <div>
                    <h2 className="text-xl font-bold text-text">{title}</h2>
                    {altLink}
                </div>
                <input
                    type="text"
                    placeholder="Enter your username"
                    required
                    className="bg-surface-bright p-1 text-text placeholder:text-text-dimmed rounded-md focus-visible:outline outline-primary invalid:outline-red-300"
                    ref={nameInputRef}
                />
                <input
                    type="password"
                    placeholder="Enter your password"
                    required
                    minLength={8}
                    maxLength={64}
                    className="bg-surface-bright p-1 text-text placeholder:text-text-dimmed rounded-md focus-visible:outline outline-primary invalid:outline-red-300"
                    ref={passwordInputRef}
                />
                <Button type="submit">Submit</Button>
            </form>
        </main>
    );
}
