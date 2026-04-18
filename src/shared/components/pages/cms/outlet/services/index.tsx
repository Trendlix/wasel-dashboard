import type { ComponentType } from "react";
import { NavLink, Outlet } from "react-router-dom";
import clsx from "clsx";
import { Sparkles, Warehouse, Megaphone } from "lucide-react";

const sectionTabs: { key: string; label: string; icon: ComponentType<{ size?: number }> }[] = [
    { key: "hero",        label: "Hero",        icon: Sparkles   },
    { key: "warehouse",   label: "Warehouse",   icon: Warehouse  },
    { key: "advertising", label: "Advertising", icon: Megaphone  },
];

const ServicesPage = () => {
    return (
        <div className="space-y-5">
            <p className="text-sm text-main-coolGray">
                Hero, warehouse, and advertising sections each have bilingual titles, descriptions, and rich cards with shared images.
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

export default ServicesPage;
