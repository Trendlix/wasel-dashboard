import type { IRecentNotification } from "@/shared/core/pages/notifications";

interface INotificationItemProps {
    item: IRecentNotification;
    isLast: boolean;
}

const NotificationItem = ({ item, }: INotificationItemProps) => {
    return (
        <div className={`py-4 flex items-start justify-between gap-4 bg-main-luxuryWhite common-rounded p-3.5`}>
            <div className="flex flex-col gap-1">
                <span className="text-main-mirage font-semibold text-sm">{item.title}</span>
                <span className="text-main-sharkGray text-xs">Sent to: {item.sentTo}</span>
            </div>
            <span className="text-main-silverSteel text-xs shrink-0">{item.sentAt}</span>
        </div>
    );
};

export default NotificationItem;