import { useEffect } from "react";
import { useParams } from "react-router-dom";
import PageTransition from "@/shared/components/common/PageTransition";
import useDetailedOpenedNotification, {
    type IDetailedUserNotification,
} from "@/shared/hooks/store/useDetailedOpenedNotification";
import NotificationDetailPage from "@/shared/components/pages/notifications/NotificationDetailPage";

const NotificationsUserDetail = () => {
    const { notificationId } = useParams<{ notificationId: string }>();
    const fetch = useDetailedOpenedNotification((s) => s.fetch);
    const reset = useDetailedOpenedNotification((s) => s.reset);
    const data = useDetailedOpenedNotification((s) => s.data);
    const loading = useDetailedOpenedNotification((s) => s.loading);
    const error = useDetailedOpenedNotification((s) => s.error);

    useEffect(() => {
        if (notificationId) fetch("user", Number(notificationId));
        return () => reset();
    }, [notificationId, fetch, reset]);

    return (
        <PageTransition>
            <NotificationDetailPage
                type="user"
                loading={loading}
                error={error}
                notification={data as IDetailedUserNotification | null}
            />
        </PageTransition>
    );
};

export default NotificationsUserDetail;
