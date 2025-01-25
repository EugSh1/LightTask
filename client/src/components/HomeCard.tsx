import { IHomeCardButton } from "../types";

interface IProps {
    title: string;
    description: string;
    buttons: IHomeCardButton[];
}

export default function HomeCard({ title, description, buttons }: IProps) {
    return (
        <div className="bg-surface rounded-md p-2 w-48 shadow-sm aspect-square flex flex-col justify-between">
            <div>
                <h2 className="text-text text-xl font-semibold">{title}</h2>
                <p className="text-text-dimmed">{description}</p>
            </div>
            <div className="flex flex-col gap-1">
                {buttons.map(({ title, action }, index) => (
                    <button
                        key={index}
                        className="bg-primary rounded-md px-3 py-1 text-text font-semibold w-fit block"
                        onClick={action}
                    >
                        {title}
                    </button>
                ))}
            </div>
        </div>
    );
}
