import clsx from "clsx";
import { useTranslation } from "react-i18next";
import { CheckCircle2, XCircle } from "lucide-react";
import type { IAdminUser } from "@/shared/core/pages/rolesAndPermissions";

interface IRoleBadgeProps {
    role: string;
    roleBg: string;
    roleText: string;
}

export const RoleBadge = ({ role, roleBg, roleText }: IRoleBadgeProps) => (
    <span className={clsx("px-3 py-1 rounded-full text-xs font-semibold", roleBg, roleText)}>
        {role}
    </span>
);

export const TwoFABadge = ({ enabled }: { enabled: boolean }) => {
    const { t } = useTranslation("roles");
    return (
        <div
            className={clsx(
                "flex items-center gap-1.5 text-xs font-medium",
                enabled ? "text-main-vividMint" : "text-main-remove",
            )}
        >
            {enabled ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
            <span>{enabled ? t("users.twoFaEnabled") : t("users.twoFaDisabled")}</span>
        </div>
    );
};

export const StatusBadge = ({
    status,
    title,
}: {
    status: IAdminUser["status"] | "blocked";
    title?: string;
}) => {
    const { t } = useTranslation("roles");
    const label = title
        ? title
        : status === "active"
          ? t("users.statusActive")
          : t("users.statusBlocked");
    return (
        <span
            className={clsx(
                "px-3 py-1 rounded-full text-xs font-medium",
                status === "active"
                    ? "bg-main-vividMint/10 text-main-vividMint"
                    : "bg-main-sharkGray/10 text-main-sharkGray",
            )}
        >
            {label}
        </span>
    );
};
