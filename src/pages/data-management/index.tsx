import { Outlet } from "react-router-dom";
import PageHeader from "@/shared/components/common/PageHeader";
import PageTransition from "@/shared/components/common/PageTransition";
import DataManagementAnalytics from "@/shared/components/pages/data-management/DataManagementAnalytics";
import DataManagementTabs from "@/shared/components/pages/data-management/DataManagementTabs";

const DataManagementLayout = () => (
    <PageTransition>
        <PageHeader
            title="Data Management"
            description="Manage truck types, goods and weights used across the platform"
        />

        <DataManagementAnalytics />

        <div className="bg-main-white border border-main-whiteMarble common-rounded overflow-hidden">
            <DataManagementTabs />
            <div>
                <Outlet />
            </div>
        </div>
    </PageTransition>
);

export default DataManagementLayout;
