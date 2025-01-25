import { Link } from "react-router-dom";
import AuthForm from "../components/AuthForm";
import useAuth from "../hooks/useAuth";

export default function LogIn() {
    const { logIn } = useAuth();

    function handleSubmit(name: string, password: string): void {
        logIn(name, password);
    }

    return (
        <AuthForm
            title="Log in"
            altLink={
                <Link to="/register" className="text-text-dimmed underline">
                    or create an account
                </Link>
            }
            onSubmit={handleSubmit}
        />
    );
}
