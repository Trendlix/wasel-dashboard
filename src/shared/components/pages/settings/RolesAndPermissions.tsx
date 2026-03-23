import { ShieldCheck } from "lucide-react";
import { roles } from "@/shared/core/pages/settings";
import SettingsSectionHeader from "./SettingsSectionHeader";
import RoleItem from "./RoleItem";

const RolesAndPermissions = () => {
    return (
        <div className="bg-main-white border border-main-whiteMarble common-rounded p-6">
            <SettingsSectionHeader
                icon={ShieldCheck}
                title="Roles & Permissions"
                iconBg="bg-main-mustardGold/10"
                iconColor="text-main-mustardGold"
            />

            <div className="flex flex-col gap-3">
                {roles.map((role) => (
                    <RoleItem key={role.id} role={role} />
                ))}
            </div>
        </div>
    );
};

export default RolesAndPermissions;