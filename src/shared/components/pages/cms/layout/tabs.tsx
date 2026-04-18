import { Blocks, CreativeCommons, LucideIcon, ConciergeBell, Phone, SearchCheck, BookOpen, FileText } from "lucide-react";
import { NavLink } from "react-router-dom";
import clsx from "clsx";

interface ITabItem {
    id: number;
    name: string;
    icon: LucideIcon;
    to: string;
}

const tabs: ITabItem[] = [
    {
        id: 1,
        name: "Common",
        icon: CreativeCommons,
        to: "/cms/common"
    },
    {
        id: 2,
        name: "About",
        icon: Blocks,
        to: "/cms/about"
    },
    {
        id: 3,
        name: "Services",
        icon: ConciergeBell,
        to: "/cms/services"
    },
    {
        id: 4,
        name: "Contact",
        icon: Phone,
        to: "/cms/contact"
    },
    {
        id: 5,
        name: "SEO",
        icon: SearchCheck,
        to: "/cms/seo"
    },
    {
        id: 6,
        name: "Blogs",
        icon: BookOpen,
        to: "/cms/blogs"
    },
    {
        id: 7,
        name: "Legal & Help",
        icon: FileText,
        to: "/cms/legal-help"
    },
];

const Tabs = () => {
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
                        {tab.name}
                    </NavLink>
                ))}
            </div>
        </div>
    );
};

export default Tabs;
