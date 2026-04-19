import type { ComponentType } from "react";
import { NavLink, Outlet } from "react-router-dom";
import clsx from "clsx";
import { Tv2, Layout, Truck, TrendingUp } from "lucide-react";
import { useTranslation } from "react-i18next";

const sectionTabs: { key: string; tabKey: "hero" | "platform" | "transport" | "maximizing"; icon: ComponentType<{ size?: number }> }[] = [
    { key: "hero", tabKey: "hero", icon: Tv2 },
    { key: "platform", tabKey: "platform", icon: Layout },
    { key: "transport", tabKey: "transport", icon: Truck },
    { key: "maximizing", tabKey: "maximizing", icon: TrendingUp },
];

const HomePage = () => {
    const { t } = useTranslation("cms");
    return (
        <div className="space-y-5">
            <p className="text-sm text-main-coolGray">
                {t("home.intro")}
            </p>
            <div className="rounded-2xl border border-main-whiteMarble bg-main-white p-2 shadow-[0_12px_30px_rgba(17,24,39,0.04)]">
                <div className="flex flex-wrap items-center gap-2">
                    {sectionTabs.map((tab) => (
                        <NavLink
                            key={tab.key}
                            to={tab.key}
                            className={({ isActive }) =>
                                clsx(
                                    "inline-flex items-center gap-2 h-10 px-4 rounded-xl text-sm font-semibold transition-all",
                                    isActive
                                        ? "bg-main-primary text-main-white shadow-[0_8px_18px_rgba(0,0,0,0.12)]"
                                        : "bg-main-titaniumWhite text-main-sharkGray hover:text-main-primary hover:bg-main-whiteMarble/70"
                                )
                            }
                        >
                            <tab.icon size={14} />
                            {t(`home.tabs.${tab.tabKey}`)}
                        </NavLink>
                    ))}
                </div>
            </div>
            <Outlet />
        </div>
    );
};

export default HomePage;
