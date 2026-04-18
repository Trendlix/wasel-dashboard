import { CircleHelp, FileText, Scale } from "lucide-react";
import { NavLink, Navigate, Outlet } from "react-router-dom";
import clsx from "clsx";

const tabs = [
    { key: "marketing-faq", label: "Marketing FAQ", to: "/cms/legal-help/marketing-faq", icon: CircleHelp },
    { key: "marketing-terms", label: "Marketing terms", to: "/cms/legal-help/marketing-terms", icon: FileText },
    { key: "marketing-privacy", label: "Marketing privacy", to: "/cms/legal-help/marketing-privacy", icon: Scale },
];

const CmsLegalHelpLayout = () => {
    return (
        <div className="space-y-4">
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

export const CmsLegalHelpIndexRedirect = () => <Navigate to="marketing-faq" replace />;

export default CmsLegalHelpLayout;
