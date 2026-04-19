import clsx from "clsx";
import { useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { sidebarItems, type ISidebarItem } from "../../core/layout/sidebar";
import useDashboardNotificationsStore from "@/shared/hooks/store/useDashboardNotificationsStore";
import useTicketStore from "@/shared/hooks/store/useTicketStore";
import useAuthStore from "@/shared/hooks/store/useAuthStore";
import { LogOut } from "lucide-react";
import { canAccessPath } from "@/shared/utils/rolePages";

const Sidebar = () => {
    return (
        <aside className="w-64 bg-main-primary common-rounded flex flex-col sticky top-7 h-max">
            <Header />
            <Nav />
            <Footer />
        </aside>
    );
};

const Nav = () => {
    const { counts, fetchNotificationsCount, initializeRealtime } = useDashboardNotificationsStore();
    const { initializeSupportSocket } = useTicketStore();
    const { userProfile } = useAuthStore();
    const supportUnreadCount = useTicketStore((s) => s.supportUnreadCount);

    useEffect(() => {
        fetchNotificationsCount();
        initializeRealtime();
    }, [fetchNotificationsCount, initializeRealtime]);

    useEffect(() => {
        if (userProfile?.id) {
            initializeSupportSocket(userProfile.id);
        }
    }, [userProfile?.id, initializeSupportSocket]);

    return (
        <nav className="p-4 w-full flex flex-col gap-1.5">
            {sidebarItems?.map((item) => {
                const hasNavAccess = canAccessPath(userProfile?.role, item.to);
                return (
                    <SidebarItem
                        hide={!hasNavAccess}
                        key={item.id}
                        item={item}
                        notificationsCount={counts.unread_total}
                        supportUnreadCount={supportUnreadCount}
                    />
                );
            })}
        </nav>
    );
};

const SidebarItem = ({
    hide,
    item,
    notificationsCount,
    supportUnreadCount,
}: {
    hide: boolean;
    item: ISidebarItem;
    notificationsCount: number;
    supportUnreadCount: number;
}) => {
    const { t } = useTranslation("sidebar");

    const baseClass =
        "inline-flex w-full min-w-0 flex-row flex-nowrap items-center gap-3 common-rounded px-3 py-2.5 text-start text-sm leading-5 capitalize transition-[background-color,color,box-shadow] duration-200 ease-linear outline-none focus-visible:ring-2 focus-visible:ring-main-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-main-primary/40";

    const badge =
        item.badgeKey === "notifications"
            ? notificationsCount
            : item.badgeKey === "support"
                ? supportUnreadCount
                : 0;

    const label = t(item.nameKey);

    return (
        <NavLink
            to={item.to}
            end={item.to === "/"}
            title={label}
            className={({ isActive }) =>
                clsx(baseClass, {
                    "hidden": hide,
                    "bg-main-white text-main-primary font-semibold shadow-sm shadow-black/10": isActive,
                    "bg-transparent text-main-white font-medium hover:bg-main-white/12": !isActive,
                })
            }
        >
            <span className="inline-flex shrink-0 size-4.5 items-center justify-center [&_svg]:size-4.5">
                <item.icon />
            </span>
            <span className="min-w-0 flex-1 truncate">{label}</span>
            {badge > 0 && (
                <span className="ms-auto rtl:ms-0 rtl:me-auto min-w-5 h-5 px-1 rounded-full bg-main-remove text-main-white text-[10px] font-bold inline-flex items-center justify-center shrink-0">
                    {badge > 99 ? "99+" : badge}
                </span>
            )}
        </NavLink>
    );
};

const Header = () => {
    const { t } = useTranslation("layout");
    return (
        <div>
            <div className="p-4">
                <img src="/brand/logo.png" alt="wasel-logo" className="w-20 h-8" />
                <p className="text-main-white/70 font-medium text-sm leading-5 mt-0.5">
                    {t("managementPanel")}
                </p>
            </div>
            <Divider />
        </div>
    );
};

const Footer = () => {
    const { logout, userProfile } = useAuthStore();
    const { t } = useTranslation("layout");
    return (
        <div className="mt-auto">
            <Divider />
            <div className="p-4 flex items-center gap-3 min-w-0 rtl:flex-row-reverse">
                <div className="bg-main-white/20 min-w-10 w-10 h-10 rounded-full uppercase text-main-white font-bold text-sm flex items-center justify-center shrink-0">
                    {userProfile?.name ? userProfile.name.charAt(0) : "A"}
                </div>

                <div className="space-y-1 flex-1 min-w-0 rtl:text-end">
                    <p className="capitalize text-main-white font-semibold text-sm truncate">
                        {userProfile?.name || t("adminUser")}
                    </p>

                    <div className="text-xs font-normal text-main-white/70 flex items-center gap-2 min-w-0 rtl:flex-row-reverse">
                        <span className="truncate flex-1">
                            {(userProfile?.email)?.toString().toLowerCase() || "admin@example.com"}
                        </span>

                        <button
                            type="button"
                            className="inline-flex items-center justify-center bg-main-red/30 rounded-md p-1.5 hover:bg-main-white transition-colors cursor-pointer shrink-0 border-0"
                            title={t("clickLogout")}
                            aria-label={t("clickLogout")}
                            onClick={logout}
                        >
                            <LogOut size={16} className="text-main-red" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const Divider = () => (
    <hr className="border-main-white/10" />
);

export default Sidebar;
