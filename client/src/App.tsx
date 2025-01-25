import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import useAuth from "./hooks/useAuth";
import Home from "./pages/Home";
import LogIn from "./pages/LogIn";
import Category from "./pages/Category";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import Sidebar from "./components/Sidebar";
import SearchPalette from "./components/SearchPalette";
import Loader from "./components/Loader";

export default function App() {
    const { isAuthenticated } = useAuth();

    if (isAuthenticated === undefined) {
        return <Loader />;
    }

    return (
        <>
            <main className="flex gap-1">
                {isAuthenticated && <Sidebar />}
                <div className="flex-1">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/category/" element={<Category categoryType="allTasks" />} />
                        <Route path="/category/:categoryName" element={<Category />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/login" element={<LogIn />} />
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </div>
            </main>
            <SearchPalette />
            <ToastContainer position="bottom-right" theme="dark" toastClassName="bg-surface" />
        </>
    );
}
