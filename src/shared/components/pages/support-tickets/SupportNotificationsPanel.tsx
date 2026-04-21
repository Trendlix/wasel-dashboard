import clsx from "clsx";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Bell, MessageSquare, CheckCircle, XCircle, Ticket, Check } from "lucide-react";
import useTicketStore, { type ISupportNotification } from "@/shared/hooks/store/useTicketStore";

const formatRelativeTime = (value: string) => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "-";

    const diffMs = Date.now() - date.getTime();
    const diffMinutes = Math.max(1, Math.floor(diffMs / (1000 * 60)));

    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 30) return `${diffDays}d ago`;

    return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
    });
};

const getNotificationIcon = (type: string) => {
    switch (type) {
        case "ticket_reply":
            return MessageSquare;
        case "ticket_closed":
            return XCircle;
        case "ticket_solved":
            return CheckCircle;
        case "new_ticket":
        default:
            return Bell;
    }
};

const getNotificationColor = (color: string) => {
    switch (color) {
        case "green":
            return {
                bg: "bg-main-vividMint/10",
                icon: "text-main-vividMint",
                ring: "ring-main-vividMint/20",
            };
        case "red":
            return {
                bg: "bg-main-remove/10",
                icon: "text-main-remove",
                ring: "ring-main-remove/20",
            };
        case "yellow":
            return {
                bg: "bg-main-mustardGold/10",
                icon: "text-main-mustardGold",
                ring: "ring-main-mustardGold/20",
            };
        case "blue":
        default:
            return {
                bg: "bg-main-primary/10",
                icon: "text-main-primary",
                ring: "ring-main-primary/20",
            };
    }
};

interface NotificationItemProps {
    notification: ISupportNotification;
    onMarkAsRead: (id: number) => void;
    onNavigateToTicket: (ticketId: number) => void;
    markingId: number | null;
}

const NotificationItem = ({
    notification,
    onMarkAsRead,
    onNavigateToTicket,
    markingId,
}: NotificationItemProps) => {
    const { t } = useTranslation("support");
    const Icon = getNotificationIcon(notification.type);
    const colors = getNotificationColor(notification.color);
    const isLoading = markingId === notification.id;

    return (
        <div
            className={clsx(
                "p-3 rounded-xl transition-colors cursor-pointer",
                notification.is_read
                    ? "bg-main-luxuryWhite/50 hover:bg-main-luxuryWhite"
                    : "bg-main-luxuryWhite hover:bg-main-whiteMarble"
            )}
            onClick={() => onNavigateToTicket(notification.ticket_id)}
        >
            <div className="flex items-start gap-3">
                <div
                    className={clsx(
                        "w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ring-2",
                        colors.bg,
                        colors.ring
                    )}
                >
                    <Icon className={clsx("w-4 h-4", colors.icon)} />
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                        <p
                            className={clsx(
                                "text-sm line-clamp-1",
                                notification.is_read
                                    ? "text-main-sharkGray font-medium"
                                    : "text-main-mirage font-semibold"
                            )}
                        >
                            {notification.title}
                        </p>
                        <span className="text-[10px] text-main-silverSteel whitespace-nowrap shrink-0">
                            {formatRelativeTime(notification.created_at)}
                        </span>
                    </div>

                    <p className="text-xs text-main-sharkGray line-clamp-2 mt-0.5">
                        {notification.description}
                    </p>

                    {notification.triggeredByName && (
                        <p className="text-[11px] text-main-sharkGray/80 mt-1">
                            {notification.triggeredByType === "driver" ? "Driver: " : "User: "}
                            <span className="font-medium">{notification.triggeredByName}</span>
                        </p>
                    )}

                    <div className="flex items-center justify-between mt-2">
                        <button
                            type="button"
                            className="inline-flex items-center gap-1 text-[10px] font-medium text-main-primary hover:underline"
                            onClick={(e) => {
                                e.stopPropagation();
                                onNavigateToTicket(notification.ticket_id);
                            }}
                        >
                            <Ticket className="w-3 h-3" />
                            #{notification.ticket_id}
                        </button>

                        {!notification.is_read && (
                            <button
                                type="button"
                                disabled={isLoading}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onMarkAsRead(notification.id);
                                }}
                                className="inline-flex items-center gap-1 h-6 px-2 rounded-md bg-main-primary/10 text-main-primary text-[10px] font-semibold hover:bg-main-primary/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <Check className="w-3 h-3" />
                                {isLoading ? t("notifications.marking") : t("notifications.markAsRead")}
                            </button>
                        )}

                        {notification.is_read && (
                            <span className="text-[10px] text-main-sharkGray/70 font-medium">
                                {t("notifications.read")}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const SkeletonItem = () => (
    <div className="p-3 rounded-xl bg-main-luxuryWhite animate-pulse">
        <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-main-whiteMarble shrink-0" />
            <div className="flex-1 space-y-2">
                <div className="h-3.5 bg-main-whiteMarble rounded w-3/4" />
                <div className="h-3 bg-main-whiteMarble rounded w-full" />
                <div className="h-3 bg-main-whiteMarble rounded w-1/2" />
            </div>
        </div>
    </div>
);

interface SupportNotificationsPanelProps {
    className?: string;
    listClassName?: string;
}

const SupportNotificationsPanel = ({ className, listClassName }: SupportNotificationsPanelProps) => {
    const { t } = useTranslation("support");
    const navigate = useNavigate();
    const {
        supportNotifications,
        supportNotificationsLoading,
        supportUnreadCount,
        markSupportNotificationAsRead,
        markAllSupportNotificationsAsRead,
    } = useTicketStore();

    const [markingId, setMarkingId] = useState<number | null>(null);
    const [markingAll, setMarkingAll] = useState(false);

    const hasUnread = useMemo(
        () => supportNotifications.some((n) => !n.is_read),
        [supportNotifications]
    );

    const handleMarkAsRead = async (id: number) => {
        setMarkingId(id);
        await markSupportNotificationAsRead(id);
        setMarkingId(null);
    };

    const handleMarkAllAsRead = async () => {
        if (!hasUnread || markingAll) return;
        setMarkingAll(true);
        await markAllSupportNotificationsAsRead();
        setMarkingAll(false);
    };

    const handleNavigateToTicket = (ticketId: number) => {
        navigate(`/support-tickets/${ticketId}/reply`);
    };

    return (
        <div
            className={clsx(
                "bg-main-white border border-main-whiteMarble common-rounded p-4 flex flex-col h-fit max-h-[calc(100vh-8rem)]",
                className
            )}
        >
            <div className="flex items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-2">
                    <h3 className="text-main-mirage font-bold text-base">
                        {t("notifications.title")}
                    </h3>
                    {supportUnreadCount > 0 && (
                        <span className="min-w-5 h-5 px-1.5 rounded-full bg-main-remove text-main-white text-[10px] font-bold inline-flex items-center justify-center">
                            {supportUnreadCount > 99 ? "99+" : supportUnreadCount}
                        </span>
                    )}
                </div>
                <button
                    type="button"
                    onClick={handleMarkAllAsRead}
                    disabled={!hasUnread || markingAll}
                    className="h-7 px-2.5 rounded-lg bg-main-primary text-main-white text-[11px] font-semibold hover:bg-main-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    {markingAll ? t("notifications.markingAll") : t("notifications.markAllAsRead")}
                </button>
            </div>

            <div
                className={clsx(
                    "space-y-2 overflow-y-auto max-h-[60vh] flex-1 -mx-1 px-1",
                    listClassName
                )}
            >
                {supportNotificationsLoading ? (
                    Array.from({ length: 5 }).map((_, idx) => <SkeletonItem key={idx} />)
                ) : supportNotifications.length > 0 ? (
                    supportNotifications.map((notification) => (
                        <NotificationItem
                            key={notification.id}
                            notification={notification}
                            onMarkAsRead={handleMarkAsRead}
                            onNavigateToTicket={handleNavigateToTicket}
                            markingId={markingId}
                        />
                    ))
                ) : (
                    <div className="rounded-xl bg-main-luxuryWhite px-4 py-8 text-center">
                        <div className="w-12 h-12 rounded-full bg-main-primary/10 flex items-center justify-center mx-auto mb-3">
                            <Bell className="w-5 h-5 text-main-primary" />
                        </div>
                        <p className="text-sm font-medium text-main-mirage">
                            {t("notifications.empty")}
                        </p>
                        <p className="text-xs text-main-sharkGray mt-1">
                            {t("notifications.emptyDescription")}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SupportNotificationsPanel;
