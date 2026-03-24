import { UserPlus } from "lucide-react";
import { adminUsers } from "@/shared/core/pages/rolesAndPermissions";
import UserRow from "./UserRow";

// ─── Table header cell ────────────────────────────────────────────────────────

const TH = ({ children }: { children: React.ReactNode }) => (
    <th className="text-main-hydrocarbon font-semibold text-sm py-4 px-6 text-left">{children}</th>
);

// ─── Section header ───────────────────────────────────────────────────────────

const AdminUsersHeader = () => (
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
);

// ─── Users table ──────────────────────────────────────────────────────────────

const AdminUsersTable = () => (
    <div className="space-y-6">
        <AdminUsersHeader />

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

export default AdminUsersTable;
