import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
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
    const { t } = useTranslation("roles");
    const { fetchMe, userProfile } = useAuthStore();
    const { users, loading, fetchUsers } = useUserManagementStore();

    const [inviteOpen, setInviteOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [removeOpen, setRemoveOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
    const [search, setSearch] = useState("");

    useEffect(() => {
        fetchMe();
        fetchUsers();
    }, [fetchMe, fetchUsers]);

    const filteredUsers = search.trim()
        ? users.filter((u) => {
              const q = search.trim().toLowerCase();
              return (
                  u.name?.toLowerCase().includes(q) ||
                  u.email?.toLowerCase().includes(q) ||
                  u.role?.name?.toLowerCase().includes(q)
              );
          })
        : users;

    const handleEdit = (user: AdminUser) => {
        setSelectedUser(user);
        setEditOpen(true);
    };

    const handleRemove = (user: AdminUser) => {
        setSelectedUser(user);
        setRemoveOpen(true);
    };

    const emptyTitle = search.trim() ? t("users.noSearchTitle") : t("users.noUsersTitle");
    const emptyDescription = search.trim()
        ? t("users.noSearchDescription", { query: search.trim() })
        : t("users.noUsersDescription");

    return (
        <div className="space-y-6">
            <AdminUsersHeader onInvite={() => setInviteOpen(true)} search={search} onSearchChange={setSearch} />

            <div className="bg-main-white border border-main-whiteMarble common-rounded overflow-hidden">
                <table className="w-full">
                    <thead className="bg-main-luxuryWhite border-b border-main-whiteMarble">
                        <tr>
                            <TH>{t("users.tableUser")}</TH>
                            <TH>{t("users.tableRole")}</TH>
                            <TH>{t("users.tableLastLogin")}</TH>
                            <TH>{t("users.tableTwoFa")}</TH>
                            <TH>{t("users.tableStatus")}</TH>
                            <TH>{t("users.tableActions")}</TH>
                        </tr>
                    </thead>
                    <tbody>
                        {loading
                            ? Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
                            : filteredUsers.map((user) => (
                                  <UserRow
                                      key={user.id}
                                      user={user}
                                      currentUser={userProfile}
                                      onEdit={handleEdit}
                                      onRemove={handleRemove}
                                  />
                              ))}
                        {!loading && filteredUsers.length === 0 && (
                            <tr>
                                <td colSpan={6}>
                                    <NoDataFound title={emptyTitle} description={emptyDescription} />
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
