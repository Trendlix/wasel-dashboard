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

const sectionTabs: { key: string; label: string; icon: ComponentType<{ size?: number }> }[] = [
    { key: "home",           label: "Home",           icon: Home         },
    { key: "about",          label: "About",          icon: Info         },
    { key: "contact",        label: "Contact",        icon: Phone        },
    { key: "services",       label: "Services",       icon: ConciergeBell },
    { key: "blogs",          label: "Blogs",          icon: BookOpen     },
    { key: "order-tracking", label: "Order Tracking", icon: MapPin     },
    { key: "faqs",           label: "FAQs",           icon: CircleHelp   },
    { key: "terms",          label: "Terms",          icon: FileText     },
    { key: "privacy",        label: "Privacy",        icon: Shield       },
];

const SeoPage = () => {
    return (
        <div className="space-y-5">
            <p className="text-sm text-main-coolGray">
                Per-route meta tags and JSON-LD. Pick a page tab, edit EN/AR fields, then save. Invalid schema JSON is flagged before publish.
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
                            {tab.label}
                        </NavLink>
                    ))}
                </div>
            </div>

            <Outlet />
        </div>
    );
};

export default SeoPage;
