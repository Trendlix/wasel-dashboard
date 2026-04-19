import { useEffect, useState } from "react";
import clsx from "clsx";
import { useTranslation } from "react-i18next";
import { formatAppDateLong } from "@/lib/formatLocaleDate";
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
    CommonModalHeader,
    CommonModalBody,
    CommonModalFooter,
} from "@/shared/components/common/CommonModal";
import { statusStyles, type TUserStatus } from "@/shared/core/pages/users";
import useUserStore, { type IAppUser } from "@/shared/hooks/store/useUserStore";

interface UserDetailsModalProps {
    user: IAppUser | null;
    open: boolean;
    onOpenChange: (v: boolean) => void;
}

const STATUS_OPTIONS: TUserStatus[] = ["active", "inactive", "blocked", "deleted"];

const UserDetailsModal = ({ user, open, onOpenChange }: UserDetailsModalProps) => {
    const { t, i18n } = useTranslation(["users", "common"]);
    const { updateStatus, updating } = useUserStore();
    const [selected, setSelected] = useState<TUserStatus>(user?.status ?? "active");

    useEffect(() => {
        if (user) setSelected(user.status);
    }, [user?.id, user?.status]);

    const handleOpenChange = (v: boolean) => {
        onOpenChange(v);
    };

    const handleSave = async () => {
        if (!user) return;
        await updateStatus(user.id, selected);
        onOpenChange(false);
    };

    if (!user) return null;

    const initials = user.full_name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

    const joinDate = formatAppDateLong(user.created_at, i18n.language);

    return (
        <CommonModal open={open} onOpenChange={handleOpenChange} loading={updating}>
            <CommonModalHeader
                title={t("users:modal.title")}
                description={t("users:modal.description")}
            />

            <CommonModalBody className="space-y-6">
                {/* Avatar + name */}
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-main-primary flex items-center justify-center shrink-0">
                        <span className="text-main-white text-lg font-bold">{initials}</span>
                    </div>
                    <div>
                        <p className="text-main-mirage font-bold text-base">{user.full_name}</p>
                        <p className="text-main-sharkGray text-sm">{user.email}</p>
                    </div>
                </div>

                {/* Info grid */}
                <div className="grid grid-cols-2 gap-4 py-4 border-t border-b border-main-whiteMarble">
                    <InfoItem label={t("users:modal.phone")} value={user.phone} />
                    <InfoItem label={t("users:modal.joined")} value={joinDate} />
                    <InfoItem
                        label={t("users:modal.emailVerified")}
                        value={user.email_verified ? t("users:yes") : t("users:no")}
                        valueClass={user.email_verified ? "text-main-vividMint" : "text-main-remove"}
                    />
                    <InfoItem
                        label={t("users:modal.phoneVerified")}
                        value={user.phone_verified ? t("users:yes") : t("users:no")}
                        valueClass={user.phone_verified ? "text-main-vividMint" : "text-main-remove"}
                    />
                    <InfoItem label={t("users:modal.voucherUsage")} value={String(user.total_voucher_usage)} />
                </div>

                {/* Status selector */}
                <div className="space-y-2">
                    <p className="text-sm font-semibold text-main-mirage">{t("users:modal.accountStatus")}</p>
                    <Select value={selected} onValueChange={(v) => setSelected(v as TUserStatus)}>
                        <SelectTrigger className="w-full h-10 border border-main-whiteMarble common-rounded px-3 text-sm">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent position="popper">
                            {STATUS_OPTIONS.map((s) => {
                                const style = statusStyles[s];
                                return (
                                    <SelectItem key={s} value={s}>
                                        <span className={clsx("px-2 py-0.5 rounded-full text-xs font-medium", style.bg, style.text)}>
                                            {t(`users:statuses.${s}`)}
                                        </span>
                                    </SelectItem>
                                );
                            })}
                        </SelectContent>
                    </Select>
                </div>
            </CommonModalBody>

            <CommonModalFooter>
                <Button
                    type="button"
                    variant="ghost"
                    className="text-main-sharkGray hover:text-main-mirage hover:bg-main-titaniumWhite px-6 h-11 common-rounded"
                    onClick={() => onOpenChange(false)}
                    disabled={updating}
                >
                    {t("common:cancel")}
                </Button>
                <Button
                    onClick={handleSave}
                    disabled={updating || selected === user.status}
                    className="bg-main-primary hover:bg-main-primary/90 text-white font-bold h-11 px-10 common-rounded"
                >
                    {updating ? t("users:modal.saving") : t("users:modal.saveChanges")}
                </Button>
            </CommonModalFooter>
        </CommonModal>
    );
};

const InfoItem = ({
    label,
    value,
    valueClass,
}: {
    label: string;
    value: string;
    valueClass?: string;
}) => (
    <div>
        <p className="text-main-sharkGray text-xs mb-0.5">{label}</p>
        <p className={clsx("text-main-mirage text-sm font-semibold", valueClass)}>{value}</p>
    </div>
);

export default UserDetailsModal;
