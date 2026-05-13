import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import clsx from "clsx";
import { Phone, Mail, CalendarDays, User, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    CommonModal,
    CommonModalFooter,
    CommonModalHeader,
} from "@/shared/components/common/CommonModal";
import { axiosNormalApiClient } from "@/shared/api";
import { showToast } from "@/shared/utils/toast";
import { formatAppDateShort } from "@/lib/formatLocaleDate";
import useUserStore, { type TAppUserStatus } from "@/shared/hooks/store/useUserStore";
import useDriverStore, { type TAppDriverStatus } from "@/shared/hooks/store/useDriverStore";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ActorProfilePanelProps {
    actor: "user" | "driver";
    actorId: number;
    className?: string;
}

interface ActorData {
    id: number;
    name: string;
    email: string | null;
    phone: string;
    status: string;
    created_at: string;
}

const USER_STATUSES: TAppUserStatus[] = ["active", "inactive", "blocked"];
const DRIVER_STATUSES: TAppDriverStatus[] = ["approved", "suspended", "blocked"];

const statusStyles: Record<string, { bg: string; text: string }> = {
    active:    { bg: "bg-main-vividMint/15",    text: "text-main-vividMint" },
    approved:  { bg: "bg-main-vividMint/15",    text: "text-main-vividMint" },
    blocked:   { bg: "bg-main-remove/15",        text: "text-main-remove" },
    suspended: { bg: "bg-main-mustardGold/15",   text: "text-main-mustardGold" },
    inactive:  { bg: "bg-main-mustardGold/15",   text: "text-main-mustardGold" },
    pending:   { bg: "bg-main-sharkGray/15",     text: "text-main-sharkGray" },
    rejected:  { bg: "bg-main-remove/15",        text: "text-main-remove" },
    deleted:   { bg: "bg-main-sharkGray/15",     text: "text-main-sharkGray" },
};

// ─── Component ────────────────────────────────────────────────────────────────

const ActorProfilePanel = ({ actor, actorId, className }: ActorProfilePanelProps) => {
    const { t, i18n } = useTranslation("support");
    const { updateStatus: updateUserStatus } = useUserStore();
    const { updateStatus: updateDriverStatus } = useDriverStore();

    const [actorData, setActorData] = useState<ActorData | null>(null);
    const [loading, setLoading] = useState(false);
    const [pendingStatus, setPendingStatus] = useState<string | null>(null);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [saving, setSaving] = useState(false);

    // ── Fetch ──────────────────────────────────────────────────────────────

    useEffect(() => {
        let cancelled = false;
        const fetchActor = async () => {
            setLoading(true);
            try {
                const endpoint =
                    actor === "user"
                        ? `/dashboard/users/${actorId}`
                        : `/dashboard/drivers/${actorId}`;
                const res = await axiosNormalApiClient.get(endpoint);
                const data = res.data?.data ?? res.data;
                if (!cancelled) {
                    setActorData({
                        id: data.id,
                        name: data.full_name ?? data.name ?? "—",
                        email: data.email ?? null,
                        phone: data.phone,
                        status: data.status,
                        created_at: data.created_at,
                    });
                }
            } catch {
                // silently fail — panel is supplementary
            } finally {
                if (!cancelled) setLoading(false);
            }
        };
        fetchActor();
        return () => { cancelled = true; };
    }, [actor, actorId]);

    // ── Status change ──────────────────────────────────────────────────────

    const handleStatusSelect = (value: string) => {
        setPendingStatus(value);
        setConfirmOpen(true);
    };

    const handleConfirm = async () => {
        if (!pendingStatus || !actorData) return;
        setSaving(true);
        try {
            if (actor === "user") {
                await updateUserStatus(actorId, pendingStatus as TAppUserStatus);
            } else {
                await updateDriverStatus(actorId, pendingStatus as TAppDriverStatus);
            }
            setActorData((prev) => prev ? { ...prev, status: pendingStatus } : prev);
            showToast(t("sessions.actorPanel.statusUpdated"), "success");
            setConfirmOpen(false);
        } catch {
            showToast(t("sessions.actorPanel.statusUpdated"), "error");
        } finally {
            setSaving(false);
            setPendingStatus(null);
        }
    };

    // ── Render ─────────────────────────────────────────────────────────────

    const statuses = actor === "user" ? USER_STATUSES : DRIVER_STATUSES;
    const initials = actorData?.name?.charAt(0)?.toUpperCase() ?? "?";
    const statusStyle = actorData ? (statusStyles[actorData.status] ?? statusStyles.inactive) : null;
    const ActorIcon = actor === "user" ? User : Truck;

    const getModalVariant = (status: string | null): "success" | "danger" | "warning" | "default" => {
        if (!status) return "warning";
        if (["active", "approved"].includes(status)) return "success";
        if (["blocked", "rejected", "deleted"].includes(status)) return "danger";
        if (["suspended", "inactive"].includes(status)) return "warning";
        return "default";
    };

    const getButtonClass = (status: string | null): string => {
        if (!status) return "bg-main-primary";
        if (["active", "approved"].includes(status)) return "bg-main-vividMint hover:bg-main-vividMint/90";
        if (["blocked", "rejected", "deleted"].includes(status)) return "bg-main-remove hover:bg-main-remove/90";
        if (["suspended", "inactive"].includes(status)) return "bg-main-mustardGold hover:bg-main-mustardGold/90";
        return "bg-main-primary hover:bg-main-primary/90";
    };

    const modalVariant = getModalVariant(pendingStatus);
    const buttonClass = getButtonClass(pendingStatus);

    return (
        <>
            <div className={clsx("bg-main-white border border-main-whiteMarble rounded-xl p-6 space-y-5", className)}>
                {/* Header */}
                <div className="flex items-center gap-2">
                    <ActorIcon className="w-4 h-4 text-main-primary" />
                    <h3 className="text-sm font-semibold text-main-mirage">
                        {t("sessions.actorPanel.title")}
                    </h3>
                    <span className="ms-auto text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-main-primary/10 text-main-primary">
                        {actor === "user" ? t("sessions.actorPanel.user") : t("sessions.actorPanel.driver")}
                    </span>
                </div>

                {loading ? (
                    <div className="space-y-3">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="h-7 rounded-lg bg-main-whiteMarble animate-pulse" />
                        ))}
                    </div>
                ) : actorData ? (
                    <>
                        {/* Avatar + name */}
                        <div className="flex items-center gap-3">
                            <div className="w-11 h-11 rounded-full bg-main-primary flex items-center justify-center shrink-0 text-main-white font-bold text-base">
                                {initials}
                            </div>
                            <div className="min-w-0">
                                <p className="text-sm font-semibold text-main-mirage truncate">
                                    {actorData.name}
                                </p>
                                <span
                                    className={clsx(
                                        "text-[11px] font-medium px-2 py-0.5 rounded-full",
                                        statusStyle?.bg,
                                        statusStyle?.text,
                                    )}
                                >
                                    {actorData.status}
                                </span>
                            </div>
                        </div>

                        {/* Contact info */}
                        <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-2 text-main-hydrocarbon">
                                <Phone className="w-3.5 h-3.5 text-main-sharkGray shrink-0" />
                                <span className="truncate">{actorData.phone}</span>
                            </div>
                            <div className="flex items-center gap-2 text-main-hydrocarbon">
                                <Mail className="w-3.5 h-3.5 text-main-sharkGray shrink-0" />
                                <span className="truncate text-sm">
                                    {actorData.email ?? (
                                        <span className="text-main-sharkGray italic">
                                            {t("sessions.actorPanel.noEmail")}
                                        </span>
                                    )}
                                </span>
                            </div>
                            <div className="flex items-center gap-2 text-main-sharkGray text-xs">
                                <CalendarDays className="w-3.5 h-3.5 shrink-0" />
                                <span>
                                    {t("sessions.actorPanel.joinedAt")}:{" "}
                                    {formatAppDateShort(actorData.created_at, i18n.language)}
                                </span>
                            </div>
                        </div>

                        {/* Status change */}
                        <div className="border-t border-main-whiteMarble pt-4 space-y-2">
                            <p className="text-xs font-semibold text-main-sharkGray uppercase tracking-wide">
                                {t("sessions.actorPanel.statusLabel")}
                            </p>
                            <Select
                                value={actorData.status}
                                onValueChange={handleStatusSelect}
                            >
                                <SelectTrigger className="h-10 border-main-whiteMarble text-main-mirage text-sm font-medium">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {statuses.map((s) => (
                                        <SelectItem key={s} value={s} className="text-sm">
                                            <span
                                                className={clsx(
                                                    "px-2 py-0.5 rounded-full text-xs font-medium",
                                                    statusStyles[s]?.bg,
                                                    statusStyles[s]?.text,
                                                )}
                                            >
                                                {s}
                                            </span>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </>
                ) : null}
            </div>

            {/* Confirm dialog */}
            <CommonModal
                open={confirmOpen}
                onOpenChange={(v) => { if (!v) { setConfirmOpen(false); setPendingStatus(null); } }}
                maxWidth="sm:max-w-[400px]"
                loading={saving}
                variant={modalVariant}
            >
                <CommonModalHeader
                    title={t("sessions.actorPanel.confirmTitle")}
                    description={t("sessions.actorPanel.confirmDescription")}
                />
                <CommonModalFooter>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => { setConfirmOpen(false); setPendingStatus(null); }}
                        disabled={saving}
                        className="h-10 px-5 border-main-whiteMarble text-main-hydrocarbon"
                    >
                        {t("sessions.actorPanel.cancel")}
                    </Button>
                    <Button
                        type="button"
                        onClick={handleConfirm}
                        disabled={saving}
                        className={clsx("h-10 px-5 text-main-white font-semibold transition-colors", buttonClass)}
                    >
                        {t("sessions.actorPanel.confirm")}
                    </Button>
                </CommonModalFooter>
            </CommonModal>
        </>
    );
};

export default ActorProfilePanel;
