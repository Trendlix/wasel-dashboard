import { useEffect } from "react";
import { useParams } from "react-router-dom";
import PageTransition from "@/shared/components/common/PageTransition";
import useDetailedOpenedNotification, {
    type IDetailedTripNotification,
} from "@/shared/hooks/store/useDetailedOpenedNotification";
import NotificationDetailPage from "@/shared/components/pages/notifications/NotificationDetailPage";

const NotificationsTripPage = () => {
    const { tripId } = useParams<{ tripId: string }>();
    const fetch = useDetailedOpenedNotification((s) => s.fetch);
    const reset = useDetailedOpenedNotification((s) => s.reset);
    const data = useDetailedOpenedNotification((s) => s.data);
    const loading = useDetailedOpenedNotification((s) => s.loading);
    const error = useDetailedOpenedNotification((s) => s.error);

    useEffect(() => {
        if (tripId) fetch("trip", Number(tripId));
        return () => reset();
    }, [tripId, fetch, reset]);

    return (
        <PageTransition>
            <NotificationDetailPage
                type="trip"
                loading={loading}
                error={error}
                notification={data as IDetailedTripNotification | null}
            />
        </PageTransition>
    );
};

export default NotificationsTripPage;
