import { recentNotifications } from "@/shared/core/pages/notifications";
import NotificationItem from "./NotificationItem";

const RecentNotifications = () => {
    return (
        <div className="bg-main-white border border-main-whiteMarble common-rounded p-6 flex flex-col gap-2 h-full">
            <h3 className="text-main-mirage font-bold text-lg mb-2">Recent Notifications</h3>

            <div className="space-y-3.5">
                {recentNotifications.map((item, index) => (
                    <NotificationItem
                        key={item.id}
                        item={item}
                        isLast={index === recentNotifications.length - 1}
                    />
                ))}
            </div>
        </div>
    );
};

export default RecentNotifications;