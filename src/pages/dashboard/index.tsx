import clsx from "clsx";
import PageHeader from "../../shared/components/common/PageHeader";
import Analytics from "../../shared/components/pages/dashboard/Analytics";
import RevenueChart from "../../shared/components/pages/dashboard/RevenueChart";
import TripsChart from "../../shared/components/pages/dashboard/TripsChart";
import Pendingverifications from "../../shared/components/pages/dashboard/Pendingverifications";
import RecentActivities from "../../shared/components/pages/dashboard/RecentActivities";
import Alert from "../../shared/components/pages/dashboard/Alert";
import PageTransition from "@/shared/components/common/PageTransition";

const DashboardPage = () => {
    return (
        <PageTransition>
            <div className={clsx("flex flex-col gap-8")}>
                <PageHeader title="Dashboard" description="Overview of platform performance and key metrics" />
                <Analytics />
                <div className="grid grid-cols-2 gap-6 *:h-fit">
                    <RevenueChart />
                    <TripsChart />
                </div>
                <div className="grid grid-cols-2 gap-6 *:h-fit">
                    <Pendingverifications />
                    <RecentActivities />
                </div>
                <Alert title="System Alert" description="3 pending driver verifications require immediate attention. Last updated 2 hours ago." />
            </div>
        </PageTransition>
    );
};

export default DashboardPage;