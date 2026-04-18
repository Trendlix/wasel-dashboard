import { ShieldCheck } from "lucide-react";
import useSettingsStore from "@/shared/hooks/store/useSettingsStore";
import SettingsSectionHeader from "./SettingsSectionHeader";
import NoDataFound from "@/shared/components/common/NoDataFound";

// ─── Colour cycle for role dots ───────────────────────────────────────────────

const ROLE_COLORS = [
    "bg-main-primary",
    "bg-main-vividMint",
    "bg-main-mustardGold",
    "bg-main-ladyBlue",
    "bg-main-roseRed",
];

// ─── Skeleton ─────────────────────────────────────────────────────────────────

const RolesAndPermissionsSkeleton = () => (
    <div className="bg-main-white border border-main-whiteMarble common-rounded p-6 animate-pulse">
        <div className="flex items-center gap-3 mb-6">
            <div className="w-11 h-11 rounded-xl bg-main-whiteMarble" />
            <div className="h-5 w-40 rounded bg-main-whiteMarble" />
        </div>
        <div className="flex flex-col gap-3">
            {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-start justify-between p-4 border border-main-whiteMarble common-rounded">
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-main-whiteMarble" />
                            <div className="h-4 w-20 rounded bg-main-whiteMarble" />
                        </div>
                        <div className="h-3 w-36 rounded bg-main-whiteMarble ml-5" />
                    </div>
                    <div className="h-3 w-12 rounded bg-main-whiteMarble" />
                </div>
            ))}
        </div>
    </div>
);

// ─── Component ────────────────────────────────────────────────────────────────

const RolesAndPermissions = () => {
    const { roles, loading } = useSettingsStore();

    if (loading) return <RolesAndPermissionsSkeleton />;

    return (
        <div className="bg-main-white border border-main-whiteMarble common-rounded p-6">
            <SettingsSectionHeader
                icon={ShieldCheck}
                title="Roles & Permissions"
                iconBg="bg-main-mustardGold/10"
                iconColor="text-main-mustardGold"
            />

            <div className="flex flex-col gap-3">
                {roles.length === 0 ? (
                    <NoDataFound
                        title="No roles configured"
                        description="No admin roles have been created yet. Add roles from the Roles & Permissions page."
                    />
                ) : (
                    roles.map((role, index) => (
                        <div
                            key={role.id}
                            className="flex items-start justify-between p-4 border border-main-whiteMarble common-rounded"
                        >
                            <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-2">
                                    <span
                                        className={`w-3 h-3 rounded-full shrink-0 ${ROLE_COLORS[index % ROLE_COLORS.length]}`}
                                    />
                                    <span className="text-main-mirage font-bold text-sm">{role.name}</span>
                                </div>
                                {role.description && (
                                    <span className="text-main-sharkGray text-sm pl-5">{role.description}</span>
                                )}
                            </div>
                            {role._count !== undefined && (
                                <span className="text-main-sharkGray text-sm shrink-0">
                                    {role._count.admin} {role._count.admin === 1 ? "user" : "users"}
                                </span>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default RolesAndPermissions;
