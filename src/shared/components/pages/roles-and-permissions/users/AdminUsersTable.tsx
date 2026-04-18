import { useEffect, useState } from "react";
import useUserManagementStore, { type AdminUser } from "@/shared/hooks/store/useUserManagementStore";
import useAuthStore from "@/shared/hooks/store/useAuthStore";
import NoDataFound from "@/shared/components/common/NoDataFound";
import SkeletonRow from "./SkeletonRow";
import TH from "./TH";
import UserRow from "./UserRow";
import AdminUsersHeader from "./AdminUsersHeader";
import InviteModal from "./InviteModal";
import EditModal from "./EditModal";
import RemoveModal from "./RemoveModal";

const AdminUsersTable = () => {
    const { fetchMe, userProfile } = useAuthStore();
    const { users, loading, fetchUsers } = useUserManagementStore();

    const [inviteOpen, setInviteOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [removeOpen, setRemoveOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);

    useEffect(() => {
        fetchMe();
        fetchUsers();
    }, []);

    const handleEdit = (user: AdminUser) => {
        setSelectedUser(user);
        setEditOpen(true);
    };

    const handleRemove = (user: AdminUser) => {
        setSelectedUser(user);
        setRemoveOpen(true);
    };

    return (
        <div className="space-y-6">
            <AdminUsersHeader onInvite={() => setInviteOpen(true)} />

            <div className="bg-main-white border border-main-whiteMarble common-rounded overflow-hidden">
                <table className="w-full">
                    <thead className="bg-main-luxuryWhite border-b border-main-whiteMarble">
                        <tr>
                            <TH>User</TH>
                            <TH>Role</TH>
                            <TH>Last Login</TH>
                            <TH>2FA</TH>
                            <TH>Status</TH>
                            <TH>Actions</TH>
                        </tr>
                    </thead>
                    <tbody>
                        {loading
                            ? Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
                            : users.map((user) => (
                                <UserRow
                                    key={user.id}
                                    user={user}
                                    currentUser={userProfile}
                                    onEdit={handleEdit}
                                    onRemove={handleRemove}
                                />
                            ))}
                        {!loading && users.length === 0 && (
                            <tr>
                                <td colSpan={6}>
                                    <NoDataFound
                                        title="No users found"
                                        description="We couldn't find any users."
                                    />
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <InviteModal open={inviteOpen} onOpenChange={setInviteOpen} />
            <EditModal open={editOpen} onOpenChange={setEditOpen} user={selectedUser} />
            <RemoveModal open={removeOpen} onOpenChange={setRemoveOpen} user={selectedUser} />
        </div>
    );
};

export default AdminUsersTable;
