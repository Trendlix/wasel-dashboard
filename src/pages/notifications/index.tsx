import clsx from "clsx";
import { NavLink, Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Bell, Truck, User, GitBranch, Tag } from "lucide-react";

const tabs = [
    { to: "driver", labelKey: "tabDriver" as const, icon: Truck },
    { to: "user", labelKey: "tabUser" as const, icon: User },
    { to: "trip", labelKey: "tabTrip" as const, icon: GitBranch },
    { to: "offers-updates", labelKey: "tabOffersUpdates" as const, icon: Tag },
] as const;

const NotificationsPage = () => {
    const { t } = useTranslation("notifications");

    return (
        <div className="space-y-5">
            <div className="rounded-2xl border border-main-whiteMarble bg-gradient-to-r from-main-white to-main-titaniumWhite/60 p-5">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-main-primary/10">
                        <Bell size={20} className="text-main-primary" />
                    </div>
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-main-lightSlate">
                            {t("layoutEyebrow")}
                        </p>
                        <h1 className="text-2xl font-bold text-main-mirage">{t("centerTitle")}</h1>
                    </div>
                </div>
                <p className="mt-3 text-sm text-main-coolGray">
                    {t("centerSubtitle")}
                </p>
            </div>

            <div className="rounded-2xl border border-main-whiteMarble bg-main-white p-2 shadow-[0_12px_30px_rgba(17,24,39,0.04)]">
                <div className="flex flex-wrap items-center gap-2">
                    {tabs.map((tab) => (
                        <NavLink
                            key={tab.to}
                            to={tab.to}
                            className={({ isActive }) =>
                                clsx(
                                    "inline-flex items-center gap-2 h-10 px-4 rounded-xl text-sm font-semibold transition-all",
                                    isActive
                                        ? "bg-main-primary text-main-white shadow-[0_8px_18px_rgba(0,0,0,0.12)]"
                                        : "bg-main-titaniumWhite text-main-sharkGray hover:text-main-primary hover:bg-main-whiteMarble/70",
                                )
                            }
                        >
                            <tab.icon size={14} />
                            {t(tab.labelKey)}
                        </NavLink>
                    ))}
                </div>
            </div>

            <Outlet />
        </div>
    );
};

export default NotificationsPage;
