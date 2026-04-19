import type { ComponentType } from "react";
import { NavLink, Outlet } from "react-router-dom";
import clsx from "clsx";
import {
    Home,
    Info,
    Phone,
    ConciergeBell,
    BookOpen,
    MapPin,
    CircleHelp,
    FileText,
    Shield,
} from "lucide-react";
import { useTranslation } from "react-i18next";

type SeoTabKey =
    | "home"
    | "about"
    | "contact"
    | "services"
    | "blogs"
    | "order_tracking"
    | "faqs"
    | "terms"
    | "privacy";

const sectionTabs: { key: string; tabKey: SeoTabKey; icon: ComponentType<{ size?: number }> }[] = [
    { key: "home", tabKey: "home", icon: Home },
    { key: "about", tabKey: "about", icon: Info },
    { key: "contact", tabKey: "contact", icon: Phone },
    { key: "services", tabKey: "services", icon: ConciergeBell },
    { key: "blogs", tabKey: "blogs", icon: BookOpen },
    { key: "order-tracking", tabKey: "order_tracking", icon: MapPin },
    { key: "faqs", tabKey: "faqs", icon: CircleHelp },
    { key: "terms", tabKey: "terms", icon: FileText },
    { key: "privacy", tabKey: "privacy", icon: Shield },
];

const SeoPage = () => {
    const { t } = useTranslation("cms");
    return (
        <div className="space-y-5">
            <p className="text-sm text-main-coolGray">
                {t("seo.intro")}
            </p>
            <div className="rounded-2xl border border-main-whiteMarble bg-main-white p-2 shadow-[0_12px_30px_rgba(17,24,39,0.04)]">
                <div className="flex flex-wrap items-center gap-2">
                    {sectionTabs.map((tab) => (
                        <NavLink
                            key={tab.key}
                            to={tab.key}
                            className={({ isActive }) =>
                                clsx(
                                    "inline-flex items-center gap-2 px-4 h-10 rounded-xl text-sm font-semibold transition-all",
                                    isActive
                                        ? "bg-main-primary text-main-white shadow-[0_8px_18px_rgba(0,0,0,0.12)]"
                                        : "bg-main-titaniumWhite text-main-sharkGray hover:text-main-primary hover:bg-main-whiteMarble/70"
                                )
                            }
                        >
                            <tab.icon size={14} />
                            {t(`seo.tabs.${tab.tabKey}`)}
                        </NavLink>
                    ))}
                </div>
            </div>

            <Outlet />
        </div>
    );
};

export default SeoPage;
