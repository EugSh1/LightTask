import { Link } from "react-router-dom";
import AuthForm from "../components/AuthForm";
import useAuth from "../hooks/useAuth";

export default function Register() {
    const { createUser } = useAuth();

    function handleSubmit(name: string, password: string): void {
        createUser(name, password);
    }

    return (
        <AuthForm
            title="Register"
            altLink={
                <Link to="/login" className="text-text-dimmed underline">
                    or log in
                </Link>
            }
            onSubmit={handleSubmit}
        />
    );
}
