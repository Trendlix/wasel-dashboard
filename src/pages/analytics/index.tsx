import { useTranslation } from "react-i18next";
import PageHeader from "@/shared/components/common/PageHeader";
import PageTransition from "@/shared/components/common/PageTransition";
import AnalyticsCards from "@/shared/components/pages/analytics/AnalyticsCards";
import TripsRevenueChart from "@/shared/components/pages/analytics/TripsRevenueChart";
import VehicleTypeChart from "@/shared/components/pages/analytics/VehicleTypeChart";
import TopDriversTable from "@/shared/components/pages/analytics/TopDriversTable";

const AnalyticsPage = () => {
    const { t } = useTranslation("analytics");
    return (
        <PageTransition>
            <PageHeader title={t("pageTitle")} description={t("pageDescription")} />
            <AnalyticsCards />
            <div className="grid grid-cols-2 gap-4">
                <TripsRevenueChart />
                <VehicleTypeChart />
            </div>
            <div className="w-full">
                <TopDriversTable />
            </div>
        </PageTransition>
    );
};

export default AnalyticsPage;