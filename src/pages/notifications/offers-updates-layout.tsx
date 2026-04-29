import clsx from "clsx";
import { NavLink, Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Tag } from "lucide-react";

const tabs = [
    { to: "users", labelKey: "tabUsers" as const },
    { to: "drivers", labelKey: "tabDrivers" as const },
] as const;

const NotificationsOffersUpdatesLayout = () => {
    const { t } = useTranslation("notifications");

    return (
        <div className="space-y-5">
            <div className="rounded-2xl border border-main-whiteMarble bg-main-white p-4 shadow-[0_12px_30px_rgba(17,24,39,0.04)]">
                <div className="flex items-center gap-2 mb-3">
                    <Tag size={16} className="text-main-primary" />
                    <p className="text-sm font-semibold text-main-mirage">{t("tabOffersUpdates")}</p>
                </div>
                <div className="flex flex-wrap items-center gap-2 *:flex-1">
                    {tabs.map((tab) => (
                        <NavLink
                            key={tab.to}
                            to={tab.to}
                            className={({ isActive }) =>
                                clsx(
                                    "inline-flex items-center justify-center  gap-2 h-10 px-4 rounded-xl text-sm font-semibold transition-all",
                                    isActive
                                        ? "bg-main-primary text-main-white shadow-[0_8px_18px_rgba(0,0,0,0.12)]"
                                        : "bg-main-titaniumWhite text-main-sharkGray hover:text-main-primary hover:bg-main-whiteMarble/70",
                                )
                            }
                        >
                            {t(tab.labelKey)}
                        </NavLink>
                    ))}
                </div>
            </div>
            <Outlet />
        </div>
    );
};

export default NotificationsOffersUpdatesLayout;
