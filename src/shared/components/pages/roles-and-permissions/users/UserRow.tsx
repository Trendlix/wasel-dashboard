import type { IAdminUser } from "@/shared/core/pages/rolesAndPermissions";
import { RoleBadge, TwoFABadge, StatusBadge } from "./UserBadges";

const UserRow = ({ user }: { user: IAdminUser }) => (
    <tr className="border-b border-main-whiteMarble hover:bg-main-luxuryWhite/50 transition-colors">
        {/* User */}
        <td className="py-4 px-6">
            <p className="text-main-mirage font-semibold text-sm">{user.name}</p>
            <p className="text-main-sharkGray text-xs mt-0.5">{user.email}</p>
        </td>

        {/* Role */}
        <td className="py-4 px-6">
            <RoleBadge role={user.role} roleBg={user.roleBg} roleText={user.roleText} />
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

export default UserRow;
