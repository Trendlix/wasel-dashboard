import { CircleHelp, FileText, Scale } from "lucide-react";
import { NavLink, Navigate, Outlet } from "react-router-dom";
import clsx from "clsx";
import { useTranslation } from "react-i18next";

const tabs = [
    { key: "marketing-faq", tabKey: "marketingFaq" as const, to: "/cms/legal-help/marketing-faq", icon: CircleHelp },
    { key: "marketing-terms", tabKey: "marketingTerms" as const, to: "/cms/legal-help/marketing-terms", icon: FileText },
    { key: "marketing-privacy", tabKey: "marketingPrivacy" as const, to: "/cms/legal-help/marketing-privacy", icon: Scale },
];

const CmsLegalHelpLayout = () => {
    const { t } = useTranslation("cms");
    return (
        <div className="space-y-4">
            <div className="rounded-2xl border border-main-whiteMarble bg-linear-to-r from-main-white to-main-titaniumWhite/70 p-5">
                <h2 className="text-xl font-bold text-main-mirage">{t("legalHelpLayout.title")}</h2>
                <p className="mt-1 text-sm text-main-coolGray">{t("legalHelpLayout.description")}</p>
            </div>
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
                            {t(`legalTabs.${tab.tabKey}`)}
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
