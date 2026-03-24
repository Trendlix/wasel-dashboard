import clsx from "clsx";
import { CheckCircle2, Circle, Pencil, Plus, Trash2 } from "lucide-react";
import { roles, type IRole, type IRolePermissions } from "@/shared/core/pages/rolesAndPermissions";

const PERMISSION_LABELS: { key: keyof IRolePermissions; label: string }[] = [
    { key: "dashboard", label: "Dashboard" },
    { key: "drivers", label: "Drivers" },
    { key: "verification", label: "Verification" },
    { key: "users", label: "Users" },
    { key: "storage", label: "Storage" },
    { key: "trips", label: "Trips" },
];

// ─── Permission item ──────────────────────────────────────────────────────────

const PermissionItem = ({ label, enabled }: { label: string; enabled: boolean }) => (
    <div className={clsx("flex items-center gap-2 text-sm", enabled ? "text-main-mirage" : "text-main-sharkGray/50")}>
        {enabled
            ? <CheckCircle2 className="w-4 h-4 text-main-vividMint shrink-0" />
            : <Circle className="w-4 h-4 text-main-sharkGray/30 shrink-0" />
        }
        <span>{label}</span>
    </div>
);

// ─── Role card ────────────────────────────────────────────────────────────────

const RoleCard = ({ role }: { role: IRole }) => {
    const leftPerms  = PERMISSION_LABELS.slice(0, 3);
    const rightPerms = PERMISSION_LABELS.slice(3);

    return (
        <div className="bg-main-luxuryWhite border border-main-whiteMarble rounded-xl p-6 flex flex-col gap-4">
            {/* Header */}
            <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                    <div className={clsx("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", role.iconBg)}>
                        <role.icon className={clsx("w-5 h-5", role.iconText)} />
                    </div>
                    <div>
                        <p className="text-main-mirage font-bold text-base leading-5">{role.name}</p>
                        <p className="text-main-sharkGray text-xs mt-0.5">{role.userCount} users</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button className="text-main-primary hover:opacity-70 transition-opacity">
                        <Pencil className="w-4 h-4" />
                    </button>
                    {!role.isProtected && (
                        <button className="text-main-remove hover:opacity-70 transition-opacity">
                            <Trash2 className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </div>

            {/* Description */}
            <p className="text-main-sharkGray text-sm">{role.description}</p>

            {/* Permissions */}
            <div>
                <p className="text-main-hydrocarbon font-semibold text-xs uppercase tracking-wide mb-3">
                    Key Permissions:
                </p>
                <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                    <div className="flex flex-col gap-2">
                        {leftPerms.map(({ key, label }) => (
                            <PermissionItem key={key} label={label} enabled={role.permissions[key]} />
                        ))}
                    </div>
                    <div className="flex flex-col gap-2">
                        {rightPerms.map(({ key, label }) => (
                            <PermissionItem key={key} label={label} enabled={role.permissions[key]} />
                        ))}
                    </div>
                </div>
            </div>

            {/* Footer link */}
            <button className="text-main-primary text-sm font-medium hover:underline text-left w-fit">
                View all permissions →
            </button>
        </div>
    );
};

// ─── Roles tab ────────────────────────────────────────────────────────────────

const RolesTab = () => {
    return (
        <div className="space-y-6">
            {/* Section header */}
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h2 className="text-main-mirage font-bold text-xl">Roles Configuration</h2>
                    <p className="text-main-sharkGray text-sm mt-1">Define roles and their access permissions</p>
                </div>
                <button className="flex items-center gap-2 bg-main-primary text-main-white font-bold text-sm px-5 h-10 rounded-lg hover:bg-main-primary/90 transition-colors shrink-0">
                    <Plus className="w-4 h-4" />
                    New Role
                </button>
            </div>

            {/* Roles grid */}
            <div className="grid grid-cols-2 gap-6">
                {roles.map((role) => (
                    <RoleCard key={role.id} role={role} />
                ))}
            </div>
        </div>
    );
};

export default RolesTab;
