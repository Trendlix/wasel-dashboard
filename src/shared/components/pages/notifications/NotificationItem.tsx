import type { IAdminDashboardNotification } from "@/shared/hooks/store/useDashboardNotificationsStore";

interface INotificationItemProps {
    item: IAdminDashboardNotification;
    tab: "user" | "driver" | "trip";
    sentAt: string;
    onMarkAsRead: (tab: "user" | "driver" | "trip", id: number) => Promise<void>;
    actionLoadingId: number | null;
}

const NotificationItem = ({ item, tab, sentAt, onMarkAsRead, actionLoadingId }: INotificationItemProps) => {
    const isRead = item.is_read ?? Boolean(item.read_at);
    const isLoading = actionLoadingId === item.id;

    return (
        <div className="py-4 flex items-start justify-between gap-4 bg-main-luxuryWhite common-rounded p-3.5">
            <div className="flex flex-col gap-1.5 min-w-0">
                <span className="text-main-mirage font-semibold text-sm">{item.title}</span>
                <span className="text-main-sharkGray text-xs line-clamp-2 pe-1">{item.description}</span>
                {!isRead ? (
                    <button
                        type="button"
                        disabled={isLoading}
                        onClick={() => onMarkAsRead(tab, item.id)}
                        className="mt-1 h-7 px-3 w-fit rounded-md bg-main-primary text-main-white text-xs font-semibold hover:bg-main-primary/90 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {isLoading ? "Marking..." : "Mark as read"}
                    </button>
                ) : null}
            </div>
            <div className="flex flex-col items-end gap-1 shrink-0">
                <span className="text-main-silverSteel text-xs">{sentAt}</span>
                {isRead ? (
                    <span className="text-[11px] font-medium text-main-sharkGray">Read</span>
                ) : (
                    <span className="text-[11px] font-semibold text-main-primary">Unread</span>
                )}
            </div>
        </div>
    );
};

export default NotificationItem;
