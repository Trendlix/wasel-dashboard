import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Ticket, ShieldAlert } from "lucide-react";
import clsx from "clsx";

const tabs = [
    { id: "all", to: "/support-tickets", nameKey: "all", icon: Ticket, end: true },
    { id: "sessions", to: "/support-tickets/sessions", nameKey: "sessions", icon: ShieldAlert, end: false },
] as const;

const SupportTicketsTabs = () => {
    const { t } = useTranslation("support");

    return (
        <div className="rounded-2xl border border-main-whiteMarble bg-main-white p-2 shadow-[0_12px_30px_rgba(17,24,39,0.04)]">
            <div className="flex flex-wrap items-center gap-2">
                {tabs.map((tab) => (
                    <NavLink
                        key={tab.id}
                        to={tab.to}
                        end={tab.end}
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
                        {t(`tabs.${tab.nameKey}`)}
                    </NavLink>
                ))}
            </div>
        </div>
    );
};

export default SupportTicketsTabs;
