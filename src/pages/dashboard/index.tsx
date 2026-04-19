import clsx from "clsx";
import { useTranslation } from "react-i18next";
import PageHeader from "../../shared/components/common/PageHeader";
import Analytics from "../../shared/components/pages/dashboard/Analytics";
import RevenueChart from "../../shared/components/pages/dashboard/RevenueChart";
import TripsChart from "../../shared/components/pages/dashboard/TripsChart";
import Pendingverifications from "../../shared/components/pages/dashboard/Pendingverifications";
import RecentActivities from "../../shared/components/pages/dashboard/RecentActivities";
import Alert from "../../shared/components/pages/dashboard/Alert";
import PageTransition from "@/shared/components/common/PageTransition";

const DashboardPage = () => {
    const { t } = useTranslation("dashboard");
    return (
        <PageTransition>
            <div className={clsx("flex flex-col gap-8")}>
                <PageHeader title={t("pageTitle")} description={t("pageDescription")} />
                <Analytics />
                <div className="grid grid-cols-2 gap-6 *:h-fit">
                    <RevenueChart />
                    <TripsChart />
                </div>
                <div className="grid grid-cols-2 gap-6 *:h-fit">
                    <Pendingverifications />
                    <RecentActivities />
                </div>
                <Alert title={t("alertTitle")} description={t("alertDescription")} />
            </div>
        </PageTransition>
    );
};

export default DashboardPage;
