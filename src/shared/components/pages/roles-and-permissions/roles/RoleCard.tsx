import clsx from "clsx";
import { Pencil, Trash2, Shield, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import type { AdminRole } from "@/shared/hooks/store/useRolesStore";
import { ROLE_PAGE_CATALOG } from "@/shared/constants/rolePagesCatalog";
import PermissionItem from "./PermissionItem";

const PERMISSION_LABELS = ROLE_PAGE_CATALOG.map(({ id, label }) => ({ key: id, label }));

const PREVIEW_TOTAL = 10;
const splitTwoCols = <T,>(items: T[]): [T[], T[]] => {
    const mid = Math.ceil(items.length / 2);
    return [items.slice(0, mid), items.slice(mid)];
};

// ─── Role icon ────────────────────────────────────────────────────────────────

const RoleIcon = ({ slug }: { slug: string }) => {
    const isSuper = slug === 'super-admin';
    return (
        <div className={clsx("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", isSuper ? "bg-main-primary" : "bg-main-whiteMarble")}>
            <Shield className={clsx("w-5 h-5", isSuper ? "text-main-white" : "text-main-sharkGray")} />
        </div>
    );
};

// ─── Role card actions ────────────────────────────────────────────────────────

interface RoleCardActionsProps {
    isProtected: boolean;
    onEdit: () => void;
    onDelete: () => void;
}

const RoleCardActions = ({ isProtected, onEdit, onDelete }: RoleCardActionsProps) => {
    if (isProtected) return null;

    return (
        <div className="flex items-center gap-2">
            <button onClick={onEdit} className="text-main-primary hover:opacity-70 transition-opacity">
                <Pencil className="w-4 h-4" />
            </button>
            <button onClick={onDelete} className="text-main-remove hover:opacity-70 transition-opacity">
                <Trash2 className="w-4 h-4" />
            </button>
        </div>
    );
};

// ─── Permissions grid ─────────────────────────────────────────────────────────

const PermissionsGrid = ({ pages, expanded, isProtected }: { pages: string[]; expanded: boolean; isProtected: boolean }) => {
    const isEnabled = (key: string) => isProtected || pages.includes(key);

    const [allLeft, allRight] = splitTwoCols(PERMISSION_LABELS);
    const [previewLeft, previewRight] = splitTwoCols(PERMISSION_LABELS.slice(0, PREVIEW_TOTAL));

    const showLeft = expanded ? allLeft : previewLeft;
    const showRight = expanded ? allRight : previewRight;

    return (
        <div>
            <p className="text-main-hydrocarbon font-semibold text-xs uppercase tracking-wide mb-3">
                Key Permissions:
            </p>

            <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                <div className="flex flex-col gap-2">
                    {showLeft.map(({ key, label }) => (
                        <PermissionItem key={key} label={label} enabled={isEnabled(key)} />
                    ))}
                </div>
                <div className="flex flex-col gap-2">
                    {showRight.map(({ key, label }) => (
                        <PermissionItem key={key} label={label} enabled={isEnabled(key)} />
                    ))}
                </div>
            </div>
        </div>
    );
};

// ─── Role card ────────────────────────────────────────────────────────────────

interface RoleCardProps {
    role: AdminRole;
    onEdit: () => void;
    onDelete: () => void;
}

const RoleCard = ({ role, onEdit, onDelete }: RoleCardProps) => {
    const isProtected = role.slug === 'super-admin';
    const [expanded, setExpanded] = useState(false);

    return (
        <div className="bg-main-luxuryWhite border border-main-whiteMarble rounded-xl p-6 flex flex-col gap-4">
            {/* Header */}
            <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                    <RoleIcon slug={role.slug} />
                    <div>
                        <p className="text-main-mirage font-bold text-base leading-5">{role.name}</p>
                        <p className="text-main-sharkGray text-xs mt-0.5">Role ID: {role.id}</p>
                    </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                    <RoleCardActions isProtected={isProtected} onEdit={onEdit} onDelete={onDelete} />
                    <div className={clsx(
                        "px-2 py-0.5 rounded-full border text-[10px] font-medium uppercase tracking-wider",
                        role.role === "admin" || role.role === "super_admin"
                            ? "bg-main-primary/10 border-main-primary/20 text-main-primary"
                            : "bg-main-vividMint/10 border-main-vividMint/20 text-main-forestTeal"
                    )}>
                        {role?.slug.replace(/-/g, " ").toUpperCase() || "N/A"}
                    </div>
                </div>
            </div>

            {/* Description */}
            <p className="text-main-sharkGray text-sm line-clamp-2 min-h-[40px]">{role.description || "No description provided."}</p>

            {/* Permissions */}
            <PermissionsGrid pages={role.pages || []} expanded={expanded} isProtected={isProtected} />

            {/* Footer */}
            {PERMISSION_LABELS.length > PREVIEW_TOTAL ? (
                <button
                    type="button"
                    onClick={() => setExpanded((prev) => !prev)}
                    className="flex items-center gap-1 text-main-primary text-sm font-medium hover:underline text-left w-fit"
                >
                    {expanded ? (
                        <>Show fewer <ChevronUp className="w-4 h-4" /></>
                    ) : (
                        <>View all permissions <ChevronDown className="w-4 h-4" /></>
                    )}
                </button>
            ) : null}
        </div>
    );
};

export default RoleCard;
