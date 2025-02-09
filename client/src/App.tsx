import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import useAuth from "./hooks/useAuth";
import Sidebar from "./components/Sidebar";
import SearchPalette from "./components/SearchPalette";
import Loader from "./components/Loader";
import { routes } from "./routes";

export default function App() {
    const { isAuthenticated } = useAuth();

    if (isAuthenticated === undefined) {
        return <Loader />;
    }

    return (
        <>
            <main className="flex gap-1">
                {isAuthenticated !== false && <Sidebar />}
                <div className="flex-1 h-screen overflow-auto">
                    <Routes>
                        {routes.map(({ path, element }) => (
                            <Route key={path} path={path} element={element} />
                        ))}
                    </Routes>
                </div>
            </main>
            <SearchPalette />
            <ToastContainer position="bottom-right" theme="dark" toastClassName="bg-surface" />
        </>
    );
}
