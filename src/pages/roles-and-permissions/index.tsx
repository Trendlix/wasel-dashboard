import { Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";
import PageHeader from "@/shared/components/common/PageHeader";
import PageTransition from "@/shared/components/common/PageTransition";
import RolesAnalytics from "@/shared/components/pages/roles-and-permissions/RolesAnalytics";
import RolesTabs from "@/shared/components/pages/roles-and-permissions/RolesTabs";

const RolesAndPermissionsLayout = () => {
    const { t } = useTranslation("roles");
    return (
    <PageTransition>
        <PageHeader title={t("pageTitle")} description={t("pageDescription")} />

        <RolesAnalytics />

        <div className="bg-main-white border border-main-whiteMarble common-rounded overflow-hidden">
            <RolesTabs />
            <div className="p-6">
                <Outlet />
            </div>
        </div>
    </PageTransition>
    );
};

export default RolesAndPermissionsLayout;