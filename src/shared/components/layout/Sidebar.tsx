import clsx from "clsx";
import { useEffect } from "react";
import { NavLink } from "react-router-dom";
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
    }, []);

    useEffect(() => {
        if (userProfile?.id) {
            initializeSupportSocket(userProfile.id);
        }
    }, [userProfile?.id]);

    return (
        <nav className="p-4 w-full space-y-1">
            {sidebarItems?.map((item) => {
                const isActive = canAccessPath(userProfile?.role, item.to);
                return (
                    <SidebarItem
                        hide={!isActive}
                        key={item.id}
                        item={item}
                        notificationsCount={counts.unread_total}
                        supportUnreadCount={supportUnreadCount}
                    />
                )
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
    const baseClass =
        "flex w-full items-center gap-3 common-rounded p-3 transition duration-200 ease-linear text-sm leading-[20px] capitalize";

    const itemKey = item.name.toLowerCase();
    const badge =
        itemKey === "notifications"
            ? notificationsCount
            : itemKey === "support tickets"
                ? supportUnreadCount
                : 0;

    return (
        <NavLink
            to={item.to}
            className={({ isActive }) =>
                clsx(baseClass, {
                    "hidden": hide,
                    "bg-main-white text-main-primary font-bold": isActive,
                    "bg-transparent text-main-white font-medium": !isActive,
                })
            }
        >
            <span>
                <item.icon />
            </span>
            <span className="truncate">{item.name}</span>
            {badge > 0 && (
                <span className="ml-auto min-w-5 h-5 px-1 rounded-full bg-main-remove text-main-white text-[10px] font-bold flex items-center justify-center">
                    {badge > 99 ? "99+" : badge}
                </span>
            )}
        </NavLink>
    );
};

const Header = () => {
    return (
        <div>
            <div className="p-4">
                <img src="/brand/logo.png" alt="wasel-logo" className="w-20 h-8" />
                <p className="text-main-white/70 font-medium text-sm leading-5 mt-0.5">
                    Management Panel
                </p>
            </div>
            <Divider />
        </div>
    );
};

const Footer = () => {
    const { logout, userProfile } = useAuthStore();
    return (
        <div className="mt-auto">
            <Divider />
            <div className="p-4 flex items-center gap-3 min-w-0">
                <div className="bg-main-white/20 min-w-10 w-10 h-10 rounded-full uppercase text-main-white font-bold text-sm flex items-center justify-center shrink-0">
                    {userProfile?.name ? userProfile.name.charAt(0) : "A"}
                </div>

                <div className="space-y-1 flex-1 min-w-0">
                    <p className="capitalize text-main-white font-semibold text-sm truncate">
                        {userProfile?.name || "Admin User"}
                    </p>

                    <div className="text-xs font-normal text-main-white/70 flex items-center gap-2 min-w-0">
                        <span className="truncate flex-1">
                            {(userProfile?.email)?.toString().toLowerCase() || "admin@example.com"}
                        </span>

                        <span
                            className="bg-main-red/30 rounded-md p-1.5 hover:bg-main-white transition-colors cursor-pointer shrink-0"
                            title="Click to logout!"
                            onClick={logout}
                        >
                            <LogOut size={16} className="text-main-red" />
                        </span>
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
