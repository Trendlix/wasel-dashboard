import clsx from "clsx";
import { CheckCircle2, UserPlus, XCircle } from "lucide-react";
import { adminUsers, type IAdminUser } from "@/shared/core/pages/rolesAndPermissions";

// ─── 2FA badge ────────────────────────────────────────────────────────────────

const TwoFABadge = ({ enabled }: { enabled: boolean }) => (
    <div className={clsx("flex items-center gap-1.5 text-xs font-medium", enabled ? "text-main-vividMint" : "text-main-remove")}>
        {enabled
            ? <CheckCircle2 className="w-4 h-4" />
            : <XCircle className="w-4 h-4" />
        }
        <span>{enabled ? "Enabled" : "Disabled"}</span>
    </div>
);

// ─── Status badge ─────────────────────────────────────────────────────────────

const StatusBadge = ({ status }: { status: IAdminUser["status"] }) => (
    <span className={clsx(
        "px-3 py-1 rounded-full text-xs font-medium",
        status === "active" ? "bg-main-vividMint/10 text-main-vividMint" : "bg-main-sharkGray/10 text-main-sharkGray"
    )}>
        {status === "active" ? "Active" : "Inactive"}
    </span>
);

// ─── Table header cell ────────────────────────────────────────────────────────

const TH = ({ children }: { children: React.ReactNode }) => (
    <th className="text-main-hydrocarbon font-semibold text-sm py-4 px-6 text-left">{children}</th>
);

// ─── Table row ────────────────────────────────────────────────────────────────

const UserRow = ({ user }: { user: IAdminUser }) => (
    <tr className="border-b border-main-whiteMarble hover:bg-main-luxuryWhite/50 transition-colors">
        {/* User */}
        <td className="py-4 px-6">
            <p className="text-main-mirage font-semibold text-sm">{user.name}</p>
            <p className="text-main-sharkGray text-xs mt-0.5">{user.email}</p>
        </td>

        {/* Role badge */}
        <td className="py-4 px-6">
            <span className={clsx("px-3 py-1 rounded-full text-xs font-semibold", user.roleBg, user.roleText)}>
                {user.role}
            </span>
        </td>

        {/* Last login */}
        <td className="py-4 px-6 text-main-sharkGray text-sm">{user.lastLogin}</td>

        {/* 2FA */}
        <td className="py-4 px-6">
            <TwoFABadge enabled={user.twoFAEnabled} />
        </td>

        {/* Status */}
        <td className="py-4 px-6">
            <StatusBadge status={user.status} />
        </td>

        {/* Actions */}
        <td className="py-4 px-6">
            <div className="flex items-center gap-4">
                <button className="text-main-primary font-semibold text-sm hover:underline">Edit</button>
                {!user.isCurrentUser && (
                    <button className="text-main-remove font-semibold text-sm hover:underline">Remove</button>
                )}
            </div>
        </td>
    </tr>
);

// ─── User Management tab ──────────────────────────────────────────────────────

const UserManagementTab = () => {
    return (
        <div className="space-y-6">
            {/* Section header */}
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h2 className="text-main-mirage font-bold text-xl">Admin Users</h2>
                    <p className="text-main-sharkGray text-sm mt-1">Manage admin panel users and their roles</p>
                </div>
                <button className="flex items-center gap-2 bg-main-vividMint text-main-white font-bold text-sm px-5 h-10 rounded-lg hover:bg-main-vividMint/90 transition-colors shrink-0">
                    <UserPlus className="w-4 h-4" />
                    Invite User
                </button>
            </div>

            {/* Table */}
            <div className="bg-main-white border border-main-whiteMarble common-rounded overflow-hidden">
                <table className="w-full">
                    <thead>
                        <tr className="bg-main-luxuryWhite border-b border-main-whiteMarble">
                            <TH>User</TH>
                            <TH>Role</TH>
                            <TH>Last Login</TH>
                            <TH>2FA Status</TH>
                            <TH>Status</TH>
                            <TH>Actions</TH>
                        </tr>
                    </thead>
                    <tbody>
                        {adminUsers.map((user) => (
                            <UserRow key={user.id} user={user} />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserManagementTab;
