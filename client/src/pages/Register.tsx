import { Link } from "react-router-dom";
import AuthForm from "../components/AuthForm";
import useAuth from "../hooks/useAuth";
import { ROUTE_PATHS } from "../routes";

export default function Register() {
    const { createUser } = useAuth();

    function handleSubmit(name: string, password: string) {
        createUser({
            name,
            password
        });
    }

    return (
        <AuthForm
            title="Register"
            altLink={
                <Link to={ROUTE_PATHS.LOGIN} className="text-text-dimmed underline">
                    or log in
                </Link>
            }
            onSubmit={handleSubmit}
        />
    );
}
