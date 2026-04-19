import { Blocks, CreativeCommons, LucideIcon, ConciergeBell, Phone, SearchCheck, BookOpen, FileText, House } from "lucide-react";
import { NavLink } from "react-router-dom";
import clsx from "clsx";
import { useTranslation } from "react-i18next";

interface ITabItem {
    id: number;
    nameKey:
        | "home"
        | "about"
        | "services"
        | "contact"
        | "seo"
        | "blogs"
        | "legalHelp"
        | "common";
    icon: LucideIcon;
    to: string;
}

const tabs: ITabItem[] = [
    { id: 0, nameKey: "home", icon: House, to: "/cms/home" },
    { id: 1, nameKey: "about", icon: Blocks, to: "/cms/about" },
    { id: 2, nameKey: "services", icon: ConciergeBell, to: "/cms/services" },
    { id: 3, nameKey: "contact", icon: Phone, to: "/cms/contact" },
    { id: 4, nameKey: "seo", icon: SearchCheck, to: "/cms/seo" },
    { id: 5, nameKey: "blogs", icon: BookOpen, to: "/cms/blogs" },
    { id: 6, nameKey: "legalHelp", icon: FileText, to: "/cms/legal-help" },
    { id: 7, nameKey: "common", icon: CreativeCommons, to: "/cms/common" },
];

const Tabs = () => {
    const { t } = useTranslation("cms");
    return (
        <div className="mb-6 rounded-2xl border border-main-whiteMarble bg-main-white p-2 shadow-[0_12px_30px_rgba(17,24,39,0.04)]">
            <div className="flex flex-wrap items-center gap-2">
                {tabs.map((tab) => (
                    <NavLink
                        key={tab.id}
                        to={tab.to}
                        end={false}
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
                        {t(`mainTabs.${tab.nameKey}`)}
                    </NavLink>
                ))}
            </div>
        </div>
    );
};

export default Tabs;
