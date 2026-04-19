import { useEffect } from "react";
import PageTransition from "@/shared/components/common/PageTransition";
import NotificationsAdminTabContent from "@/shared/components/pages/notifications/NotificationsAdminTabContent";
import useDriverAdminNotificationsStore from "@/shared/hooks/store/useDriverAdminNotificationsStore";

const NotificationsDriverTab = () => {
    const store = useDriverAdminNotificationsStore();
    const { fetchNotifications, search, readFilter, sortValue, page } = store;

    useEffect(() => {
        fetchNotifications();
    }, [search, readFilter, sortValue, page]);

    return (
        <PageTransition>
            <NotificationsAdminTabContent type="driver" store={store} />
        </PageTransition>
    );
};

export default NotificationsDriverTab;
