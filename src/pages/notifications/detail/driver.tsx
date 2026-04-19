import { useEffect } from "react";
import { useParams } from "react-router-dom";
import PageTransition from "@/shared/components/common/PageTransition";
import useDetailedOpenedNotification, {
    type IDetailedDriverNotification,
} from "@/shared/hooks/store/useDetailedOpenedNotification";
import NotificationDetailPage from "@/shared/components/pages/notifications/NotificationDetailPage";

const NotificationsDriverDetail = () => {
    const { notificationId } = useParams<{ notificationId: string }>();
    const fetch = useDetailedOpenedNotification((s) => s.fetch);
    const reset = useDetailedOpenedNotification((s) => s.reset);
    const data = useDetailedOpenedNotification((s) => s.data);
    const loading = useDetailedOpenedNotification((s) => s.loading);
    const error = useDetailedOpenedNotification((s) => s.error);

    useEffect(() => {
        if (notificationId) fetch("driver", Number(notificationId));
        return () => reset();
    }, [notificationId, fetch, reset]);

    return (
        <PageTransition>
            <NotificationDetailPage
                type="driver"
                loading={loading}
                error={error}
                notification={data as IDetailedDriverNotification | null}
            />
        </PageTransition>
    );
};

export default NotificationsDriverDetail;
