import { UserPlus } from "lucide-react";

interface AdminUsersHeaderProps {
    onInvite: () => void;
}

const AdminUsersHeader = ({ onInvite }: AdminUsersHeaderProps) => (
    <div className="flex items-start justify-between gap-4">
        <div>
            <h2 className="text-main-mirage font-bold text-xl">Admin Users</h2>
            <p className="text-main-sharkGray text-sm mt-1">Manage admin panel users and their roles</p>
        </div>
        <button
            onClick={onInvite}
            className="flex items-center gap-2 bg-main-vividMint text-main-white font-bold text-sm px-5 h-10 common-rounded hover:bg-main-vividMint/90 transition-colors shrink-0"
        >
            <UserPlus className="w-4 h-4" />
            Invite User
        </button>
    </div>
);

export default AdminUsersHeader;
