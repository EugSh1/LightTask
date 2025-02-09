import { Link } from "react-router-dom";
import AuthForm from "../components/AuthForm";
import useAuth from "../hooks/useAuth";
import { ROUTE_PATHS } from "../routes";

export default function LogIn() {
    const { logIn } = useAuth();

    function handleSubmit(name: string, password: string) {
        logIn({
            name,
            password
        });
    }

    return (
        <AuthForm
            title="Log in"
            altLink={
                <Link to={ROUTE_PATHS.REGISTER} className="text-text-dimmed underline">
                    or create an account
                </Link>
            }
            onSubmit={handleSubmit}
        />
    );
}
