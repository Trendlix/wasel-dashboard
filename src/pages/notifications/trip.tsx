import { useEffect } from "react";
import PageTransition from "@/shared/components/common/PageTransition";
import NotificationsAdminTabContent from "@/shared/components/pages/notifications/NotificationsAdminTabContent";
import useTripAdminNotificationsStore from "@/shared/hooks/store/useTripAdminNotificationsStore";

const NotificationsTripTab = () => {
    const store = useTripAdminNotificationsStore();
    const { fetchNotifications, search, readFilter, sortValue, page } = store;

    useEffect(() => {
        fetchNotifications();
    }, [search, readFilter, sortValue, page]);

    return (
        <PageTransition>
            <NotificationsAdminTabContent type="trip" store={store} />
        </PageTransition>
    );
};

export default NotificationsTripTab;
