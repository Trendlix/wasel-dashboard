import clsx from "clsx";
import { Pencil, Trash2 } from "lucide-react";
import type { IRole, IRolePermissions } from "@/shared/core/pages/rolesAndPermissions";
import PermissionItem from "./PermissionItem";

const PERMISSION_LABELS: { key: keyof IRolePermissions; label: string }[] = [
    { key: "dashboard",    label: "Dashboard"    },
    { key: "drivers",      label: "Drivers"      },
    { key: "verification", label: "Verification" },
    { key: "users",        label: "Users"        },
    { key: "storage",      label: "Storage"      },
    { key: "trips",        label: "Trips"        },
];

const LEFT_PERMS  = PERMISSION_LABELS.slice(0, 3);
const RIGHT_PERMS = PERMISSION_LABELS.slice(3);

// ─── Role icon ────────────────────────────────────────────────────────────────

const RoleIcon = ({ role }: { role: IRole }) => (
    <div className={clsx("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", role.iconBg)}>
        <role.icon className={clsx("w-5 h-5", role.iconText)} />
    </div>
);

// ─── Role card actions ────────────────────────────────────────────────────────

const RoleCardActions = ({ isProtected }: { isProtected?: boolean }) => (
    <div className="flex items-center gap-2">
        <button className="text-main-primary hover:opacity-70 transition-opacity">
            <Pencil className="w-4 h-4" />
        </button>
        {!isProtected && (
            <button className="text-main-remove hover:opacity-70 transition-opacity">
                <Trash2 className="w-4 h-4" />
            </button>
        )}
    </div>
);

// ─── Permissions grid ─────────────────────────────────────────────────────────

const PermissionsGrid = ({ permissions }: { permissions: IRole["permissions"] }) => (
    <div>
        <p className="text-main-hydrocarbon font-semibold text-xs uppercase tracking-wide mb-3">
            Key Permissions:
        </p>
        <div className="grid grid-cols-2 gap-x-6 gap-y-2">
            <div className="flex flex-col gap-2">
                {LEFT_PERMS.map(({ key, label }) => (
                    <PermissionItem key={key} label={label} enabled={permissions[key]} />
                ))}
            </div>
            <div className="flex flex-col gap-2">
                {RIGHT_PERMS.map(({ key, label }) => (
                    <PermissionItem key={key} label={label} enabled={permissions[key]} />
                ))}
            </div>
        </div>
    </div>
);

// ─── Role card ────────────────────────────────────────────────────────────────

const RoleCard = ({ role }: { role: IRole }) => (
    <div className="bg-main-luxuryWhite border border-main-whiteMarble rounded-xl p-6 flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
                <RoleIcon role={role} />
                <div>
                    <p className="text-main-mirage font-bold text-base leading-5">{role.name}</p>
                    <p className="text-main-sharkGray text-xs mt-0.5">{role.userCount} users</p>
                </div>
            </div>
            <RoleCardActions isProtected={role.isProtected} />
        </div>

        {/* Description */}
        <p className="text-main-sharkGray text-sm">{role.description}</p>

        {/* Permissions */}
        <PermissionsGrid permissions={role.permissions} />

        {/* Footer */}
        <button className="text-main-primary text-sm font-medium hover:underline text-left w-fit">
            View all permissions →
        </button>
    </div>
);

export default RoleCard;
