import { BookOpen, Info } from "lucide-react";
import { NavLink, Navigate, Outlet } from "react-router-dom";
import clsx from "clsx";

const tabs = [
    { key: "info", label: "Info", to: "/cms/blogs/info", icon: Info },
    { key: "items", label: "Blog Items", to: "/cms/blogs/blog-items", icon: BookOpen },
];

const CmsBlogsLayout = () => {
    return (
        <div className="space-y-4">
            <p className="text-sm text-main-coolGray">
                Configure the blogs landing (info + cards) and manage individual posts under Blog Items.
            </p>
            <div className="rounded-2xl border border-main-whiteMarble bg-main-white p-2 shadow-[0_12px_30px_rgba(17,24,39,0.04)]">
                <div className="flex flex-wrap items-center gap-2">
                    {tabs.map((tab) => (
                        <NavLink
                            key={tab.key}
                            to={tab.to}
                            className={({ isActive }) =>
                                clsx(
                                    "group inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all",
                                    isActive
                                        ? "bg-main-primary text-main-white shadow-[0_8px_18px_rgba(0,0,0,0.12)]"
                                        : "bg-main-titaniumWhite text-main-sharkGray hover:bg-main-whiteMarble/70 hover:text-main-primary"
                                )
                            }
                        >
                            <tab.icon size={16} className="opacity-90 group-hover:opacity-100" />
                            {tab.label}
                        </NavLink>
                    ))}
                </div>
            </div>
            <Outlet />
        </div>
    );
};

export const CmsBlogsIndexRedirect = () => <Navigate to="info" replace />;

export default CmsBlogsLayout;
