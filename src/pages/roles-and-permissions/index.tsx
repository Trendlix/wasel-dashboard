import { Outlet } from "react-router-dom";
import PageHeader from "@/shared/components/common/PageHeader";
import PageTransition from "@/shared/components/common/PageTransition";
import RolesAnalytics from "@/shared/components/pages/roles-and-permissions/RolesAnalytics";
import RolesTabs from "@/shared/components/pages/roles-and-permissions/RolesTabs";

const RolesAndPermissionsLayout = () => (
    <PageTransition>
        <PageHeader
            title="Roles & Permissions"
            description="Manage user roles and access control across the admin panel"
        />

        <RolesAnalytics />

        <div className="bg-main-white border border-main-whiteMarble common-rounded overflow-hidden">
            <RolesTabs />
            <div className="p-6">
                <Outlet />
            </div>
        </div>
    </PageTransition>
);

export default RolesAndPermissionsLayout;