import { Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";
import PageHeader from "@/shared/components/common/PageHeader";
import PageTransition from "@/shared/components/common/PageTransition";
import DataManagementAnalytics from "@/shared/components/pages/data-management/DataManagementAnalytics";
import DataManagementTabs from "@/shared/components/pages/data-management/DataManagementTabs";

const DataManagementLayout = () => {
    const { t } = useTranslation("dataManagement");
    return (
    <PageTransition>
        <PageHeader title={t("pageTitle")} description={t("pageDescription")} />

        <DataManagementAnalytics />

        <div className="bg-main-white border border-main-whiteMarble common-rounded overflow-hidden">
            <DataManagementTabs />
            <div>
                <Outlet />
            </div>
        </div>
    </PageTransition>
    );
};

export default DataManagementLayout;
