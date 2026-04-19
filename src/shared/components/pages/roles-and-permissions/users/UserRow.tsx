import { Pencil, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { AdminUser } from "@/shared/hooks/store/useUserManagementStore";
import { RoleBadge, TwoFABadge, StatusBadge } from "./UserBadges";
import { getTokenStoredInCookie } from "@/shared/utils/cookieUtils";
import { formatAppDateTime } from "@/lib/formatLocaleDate";

interface UserRowProps {
    user: AdminUser;
    currentUser: { id: number; role: { slug: string } } | null;
    onEdit: (user: AdminUser) => void;
    onRemove: (user: AdminUser) => void;
}

const UserRow = ({ user, currentUser, onEdit, onRemove }: UserRowProps) => {
    const { t, i18n } = useTranslation("roles");
    const tokenData = getTokenStoredInCookie("wasel_admin_access_token") as { admin_id: string };
    const isMe = String(tokenData?.admin_id) === String(user.id);

    const isCurrentSuperAdmin = currentUser?.role?.slug === "super-admin";
    const isTargetSuperAdmin = user.role?.slug === "super-admin";

    const canManage = isCurrentSuperAdmin || !isTargetSuperAdmin;

    const lastLoginDisplay = user.last_login
        ? formatAppDateTime(user.last_login, i18n.language)
        : t("users.neverLoggedIn");

    return (
        <tr className="border-b border-main-whiteMarble hover:bg-main-luxuryWhite/50 transition-colors">
            <td className="py-4 px-6">
                <p className="text-main-mirage font-semibold text-sm">{user.name ?? "—"}</p>
                <p className="text-main-sharkGray text-xs mt-0.5">{user.email}</p>
            </td>
            <td className="py-4 px-6">
                <RoleBadge role={user.role?.name ?? "—"} roleBg="bg-main-mirage" roleText="text-main-white" />
            </td>
            <td className="py-4 px-6 text-main-sharkGray text-sm">{lastLoginDisplay}</td>
            <td className="py-4 px-6">
                <TwoFABadge enabled={user.twofa_enabled} />
            </td>
            <td className="py-4 px-6">
                <StatusBadge status={user.status === "blocked" ? "blocked" : "active"} />
            </td>
            <td className="py-4 px-6">
                {!isMe ? (
                    canManage ? (
                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={() => onEdit(user)}
                                className="text-main-primary hover:opacity-70 transition-opacity"
                                aria-label={t("users.editAria")}
                            >
                                <Pencil className="w-4 h-4" />
                            </button>
                            <button
                                type="button"
                                onClick={() => onRemove(user)}
                                className="text-main-remove hover:opacity-70 transition-opacity"
                                aria-label={t("users.removeAria")}
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    ) : (
                        <StatusBadge status="blocked" title={t("users.badgeProtected")} />
                    )
                ) : (
                    <StatusBadge status="blocked" title={t("users.badgeYou")} />
                )}
            </td>
        </tr>
    );
};

export default UserRow;
