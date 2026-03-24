import clsx from "clsx";
import { CheckCircle2, XCircle } from "lucide-react";
import type { IAdminUser } from "@/shared/core/pages/rolesAndPermissions";

// ─── Role badge ───────────────────────────────────────────────────────────────

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

// ─── 2FA badge ────────────────────────────────────────────────────────────────

export const TwoFABadge = ({ enabled }: { enabled: boolean }) => (
    <div className={clsx("flex items-center gap-1.5 text-xs font-medium", enabled ? "text-main-vividMint" : "text-main-remove")}>
        {enabled
            ? <CheckCircle2 className="w-4 h-4" />
            : <XCircle className="w-4 h-4" />
        }
        <span>{enabled ? "Enabled" : "Disabled"}</span>
    </div>
);

// ─── Status badge ─────────────────────────────────────────────────────────────

export const StatusBadge = ({ status }: { status: IAdminUser["status"] }) => (
    <span className={clsx(
        "px-3 py-1 rounded-full text-xs font-medium",
        status === "active"
            ? "bg-main-vividMint/10 text-main-vividMint"
            : "bg-main-sharkGray/10 text-main-sharkGray"
    )}>
        {status === "active" ? "Active" : "Inactive"}
    </span>
);
