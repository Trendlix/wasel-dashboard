import { FilePlus2, Files } from "lucide-react";
import { NavLink, Navigate, Outlet } from "react-router-dom";
import clsx from "clsx";
import { useTranslation } from "react-i18next";

const tabs = [
    { key: "all", tabKey: "all" as const, to: "/cms/blogs/blog-items", icon: Files, end: true },
    { key: "new", tabKey: "new" as const, to: "/cms/blogs/blog-items/new", icon: FilePlus2, end: false },
];

const CmsBlogsItemsLayout = () => {
    const { t } = useTranslation("cms");
    return (
        <div className="space-y-4">
            <div className="rounded-2xl border border-main-whiteMarble bg-main-white p-2 shadow-[0_10px_28px_rgba(17,24,39,0.04)]">
                <div className="flex flex-wrap items-center gap-2">
                    {tabs.map((tab) => (
                        <NavLink
                            key={tab.key}
                            to={tab.to}
                            end={tab.end}
                            className={({ isActive }) =>
                                clsx(
                                    "group inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition-all",
                                    isActive
                                        ? "bg-main-primary text-main-white shadow-[0_8px_18px_rgba(0,0,0,0.12)]"
                                        : "bg-main-titaniumWhite text-main-sharkGray hover:bg-main-whiteMarble/70 hover:text-main-primary"
                                )
                            }
                        >
                            <tab.icon size={15} className="opacity-90 group-hover:opacity-100" />
                            {t(`blogItemsNav.${tab.tabKey}`)}
                        </NavLink>
                    ))}
                </div>
            </div>
            <Outlet />
        </div>
    );
};

export const CmsBlogsItemsIndexRedirect = () => <Navigate to="/cms/blogs/blog-items" replace />;

export default CmsBlogsItemsLayout;
