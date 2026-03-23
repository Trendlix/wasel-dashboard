import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

const Layout = () => {
    return (
        <div className="px-5 py-7 flex gap-7 min-h-screen bg-main-titaniumWhite">
            <Sidebar />
            <main className="flex-1">
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;