import clsx from "clsx";
import { useEffect, useMemo, useState } from "react";
import { notificationsFilterTabs } from "@/shared/core/pages/notifications";
import useDashboardNotificationsStore from "@/shared/hooks/store/useDashboardNotificationsStore";
import NotificationItem from "./NotificationItem";

const formatRelativeTime = (value: string) => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "-";

    const diffMs = Date.now() - date.getTime();
    const diffMinutes = Math.max(1, Math.floor(diffMs / (1000 * 60)));

    if (diffMinutes < 60) return `${diffMinutes} min ago`;
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 30) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;

    return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
};

const RecentNotifications = () => {
    const {
        notifications,
        loading,
        activeTab,
        setActiveTab,
        fetchNotifications,
        counts,
        markAllNotificationsAsRead,
        markTabNotificationsAsRead,
        markNotificationItemAsRead,
    } = useDashboardNotificationsStore();
    const [headerActionLoading, setHeaderActionLoading] = useState(false);
    const [tabActionLoading, setTabActionLoading] = useState(false);
    const [itemActionLoadingId, setItemActionLoadingId] = useState<number | null>(null);

    useEffect(() => {
        fetchNotifications();
    }, []);

    const list = notifications[activeTab] ?? [];
    const hasUnreadAny = counts.unread_total > 0;
    const hasUnreadInActiveTab = useMemo(
        () => list.some((item) => !(item.is_read ?? Boolean(item.read_at))),
        [list],
    );

    const handleMarkAll = async () => {
        if (!hasUnreadAny || headerActionLoading) return;
        try {
            setHeaderActionLoading(true);
            await markAllNotificationsAsRead();
        } finally {
            setHeaderActionLoading(false);
        }
    };

    const handleMarkActiveTab = async () => {
        if (!hasUnreadInActiveTab || tabActionLoading) return;
        try {
            setTabActionLoading(true);
            await markTabNotificationsAsRead(activeTab);
        } finally {
            setTabActionLoading(false);
        }
    };

    const handleMarkItem = async (tab: "user" | "driver" | "trip", id: number) => {
        try {
            setItemActionLoadingId(id);
            await markNotificationItemAsRead(tab, id);
        } finally {
            setItemActionLoadingId(null);
        }
    };

    return (
        <div className="bg-main-white border border-main-whiteMarble common-rounded p-6 flex flex-col gap-2 h-full">
            <div className="flex items-center justify-between gap-3 mb-2">
                <h3 className="text-main-mirage font-bold text-lg">Recent Notifications</h3>
                <button
                    type="button"
                    onClick={handleMarkAll}
                    disabled={!hasUnreadAny || headerActionLoading}
                    className="h-8 px-3 rounded-lg bg-main-primary text-main-white text-xs font-semibold hover:bg-main-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {headerActionLoading ? "Marking..." : "Mark all as read"}
                </button>
            </div>

            <div className="flex items-center justify-between gap-3 mb-2">
                <div className="inline-flex items-center gap-2 bg-main-luxuryWhite p-1 rounded-xl w-fit">
                    {notificationsFilterTabs.map((tab) => {
                        const active = activeTab === tab.value;
                        return (
                            <button
                                key={tab.value}
                                type="button"
                                onClick={() => setActiveTab(tab.value)}
                                className={clsx(
                                    "px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors",
                                    active
                                        ? "bg-main-primary text-main-white"
                                        : "text-main-sharkGray hover:text-main-mirage",
                                )}
                            >
                                {tab.label}
                            </button>
                        );
                    })}
                </div>

                <button
                    type="button"
                    onClick={handleMarkActiveTab}
                    disabled={!hasUnreadInActiveTab || tabActionLoading}
                    className="h-8 px-3 rounded-lg border border-main-primary text-main-primary text-xs font-semibold hover:bg-main-primary/10 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {tabActionLoading ? "Marking..." : `Mark ${activeTab} as read`}
                </button>
            </div>

            <div className="space-y-3.5 max-h-[55vh] overflow-y-auto">
                {loading ? (
                    Array.from({ length: 5 }).map((_, idx) => (
                        <div
                            key={idx}
                            className="h-[72px] rounded bg-main-luxuryWhite animate-pulse"
                        />
                    ))
                ) : list.length > 0 ? (
                    list.map((item) => (
                        <NotificationItem
                            key={`${activeTab}-${item.id}`}
                            item={item}
                            tab={activeTab}
                            sentAt={formatRelativeTime(item.created_at)}
                            onMarkAsRead={handleMarkItem}
                            actionLoadingId={itemActionLoadingId}
                        />
                    ))
                ) : (
                    <div className="rounded bg-main-luxuryWhite px-4 py-6 text-sm text-main-sharkGray text-center">
                        No notifications for this tab.
                    </div>
                )}
            </div>
        </div>
    );
};

export default RecentNotifications;
