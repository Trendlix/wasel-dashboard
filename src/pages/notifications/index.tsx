import PageHeader from "@/shared/components/common/PageHeader";
import PageTransition from "@/shared/components/common/PageTransition";
import NotificationForm from "@/shared/components/pages/notifications/NotificationForm";
import RecentNotifications from "@/shared/components/pages/notifications/RecentNotifications";

const NotificationsPage = () => {
    return (
        <PageTransition>
            <PageHeader title="Notifications" description="Send push notifications and announcements" />
            <div className="grid grid-cols-2 gap-6 items-start">
                <NotificationForm />
                <RecentNotifications />
            </div>
        </PageTransition>
    );
};

export default NotificationsPage;