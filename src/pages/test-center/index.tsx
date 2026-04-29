import clsx from "clsx";
import { FlaskConical, GitBranch } from "lucide-react";
import { NavLink, Navigate, Outlet } from "react-router-dom";
import useAuthStore from "@/shared/hooks/store/useAuthStore";

const TestCenterPage = () => {
    const roleSlug = useAuthStore((s) => s.userProfile?.role?.slug);
    const isSuperAdmin = roleSlug === "super-admin" || roleSlug === "super_admin";

    if (roleSlug && !isSuperAdmin) {
        return <Navigate to="/" replace />;
    }

    return (
        <div className="space-y-5">
            <div className="rounded-2xl border border-main-whiteMarble bg-linear-to-r from-main-white to-main-titaniumWhite/60 p-5">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-main-primary/10">
                        <FlaskConical size={20} className="text-main-primary" />
                    </div>
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-main-lightSlate">
                            Internal Tools
                        </p>
                        <h1 className="text-2xl font-bold text-main-mirage">Test Center</h1>
                    </div>
                </div>
                <p className="mt-3 text-sm text-main-coolGray">
                    Create requests directly for testing without the mobile app.
                </p>
            </div>

            <div className="rounded-2xl border border-main-whiteMarble bg-main-white p-2 shadow-[0_12px_30px_rgba(17,24,39,0.04)]">
                <NavLink
                    to="trip"
                    className={({ isActive }) =>
                        clsx(
                            "inline-flex items-center gap-2 h-10 px-4 rounded-xl text-sm font-semibold transition-all",
                            isActive
                                ? "bg-main-primary text-main-white shadow-[0_8px_18px_rgba(0,0,0,0.12)]"
                                : "bg-main-titaniumWhite text-main-sharkGray hover:text-main-primary hover:bg-main-whiteMarble/70",
                        )
                    }
                >
                    <GitBranch size={14} />
                    Trip
                </NavLink>
            </div>

            <Outlet />
        </div>
    );
};

export default TestCenterPage;
