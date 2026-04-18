import PageTransition from "@/shared/components/common/PageTransition";
import { Outlet } from "react-router-dom";

const NotificationsPage = () => {
    return (
        <PageTransition>
            <Outlet />
        </PageTransition>
    );
};

export default NotificationsPage;
