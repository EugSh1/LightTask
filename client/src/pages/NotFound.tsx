import { Link } from "react-router-dom";
import { ROUTE_PATHS } from "../routes";

export default function NotFound() {
    return (
        <main className="flex flex-col gap-1 justify-center items-center h-screen">
            <h1 className="text-2xl font-bold text-text">Page not found</h1>
            <Link to={ROUTE_PATHS.HOME} className="text-lg font-bold underline text-primary">
                Back to home
            </Link>
        </main>
    );
}
