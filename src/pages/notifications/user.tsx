import { useEffect } from "react";
import PageTransition from "@/shared/components/common/PageTransition";
import NotificationsAdminTabContent from "@/shared/components/pages/notifications/NotificationsAdminTabContent";
import useUserAdminNotificationsStore from "@/shared/hooks/store/useUserAdminNotificationsStore";

const NotificationsUserTab = () => {
    const store = useUserAdminNotificationsStore();
    const { fetchNotifications, search, readFilter, sortValue, page } = store;

    useEffect(() => {
        fetchNotifications();
    }, [search, readFilter, sortValue, page]);

    return (
        <PageTransition>
            <NotificationsAdminTabContent type="user" store={store} />
        </PageTransition>
    );
};

export default NotificationsUserTab;
