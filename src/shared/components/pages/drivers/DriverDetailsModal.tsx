import { useState } from "react";
import clsx from "clsx";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
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
import { driverStatusStyles, type TDriverStatus } from "@/shared/core/pages/drivers";
import useDriverStore, { type IAppDriver } from "@/shared/hooks/store/useDriverStore";
import { formatAppDateLong } from "@/lib/formatLocaleDate";

interface DriverDetailsModalProps {
    driver: IAppDriver | null;
    open: boolean;
    onOpenChange: (v: boolean) => void;
}

const STATUS_OPTIONS: TDriverStatus[] = [
    "pending",
    "approved",
    "suspended",
    "blocked",
    "rejected",
    "deleted",
];

const DriverDetailsModal = ({ driver, open, onOpenChange }: DriverDetailsModalProps) => {
    const { t, i18n } = useTranslation(["drivers", "common"]);
    const navigate = useNavigate();
    const { updateStatus, updating } = useDriverStore();
    const [selected, setSelected] = useState<TDriverStatus>(driver?.status ?? "pending");

    const handleOpenChange = (v: boolean) => {
        onOpenChange(v);
    };

    const handleSave = async () => {
        if (!driver) return;
        await updateStatus(driver.id, selected);
        onOpenChange(false);
    };

    if (!driver) return null;

    const displayName = driver.name ?? t("drivers:defaultDriverName");
    const initials = displayName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

    const joinDate = formatAppDateLong(driver.created_at, i18n.language);

    return (
        <CommonModal open={open} onOpenChange={handleOpenChange} loading={updating}>
            <CommonModalHeader
                title={t("drivers:modal.title")}
                description={t("drivers:modal.description")}
            />

            <CommonModalBody className="space-y-6">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-main-primary flex items-center justify-center shrink-0">
                        <span className="text-main-white text-lg font-bold">{initials}</span>
                    </div>
                    <div>
                        <p className="text-main-mirage font-bold text-base">{displayName}</p>
                        <p className="text-main-sharkGray text-sm">{driver.email ?? "—"}</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 py-4 border-t border-b border-main-whiteMarble">
                    <InfoItem label={t("drivers:modal.phone")} value={driver.phone} />
                    <InfoItem label={t("drivers:modal.joined")} value={joinDate} />
                    <InfoItem
                        label={t("drivers:modal.rating")}
                        value={driver.rating ? String(driver.rating) : t("drivers:ratingNA")}
                    />
                    <InfoItem label={t("drivers:modal.status")} value={t(`drivers:statuses.${driver.status}`)} />
                </div>

                <div className="space-y-2">
                    <p className="text-sm font-semibold text-main-mirage">{t("drivers:modal.accountStatus")}</p>
                    <Select value={selected} onValueChange={(v) => setSelected(v as TDriverStatus)}>
                        <SelectTrigger className="w-full h-10 border border-main-whiteMarble common-rounded px-3 text-sm">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent position="popper">
                            {STATUS_OPTIONS.map((s) => {
                                const style = driverStatusStyles[s];
                                return (
                                    <SelectItem key={s} value={s}>
                                        <span className={clsx("px-2 py-0.5 rounded-full text-xs font-medium", style.bg, style.text)}>
                                            {t(`drivers:statuses.${s}`)}
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
                    className="me-auto h-11 px-4 bg-main-primary/10 text-main-primary hover:bg-main-primary/15 border border-main-primary/20 common-rounded font-semibold"
                    onClick={() => {
                        onOpenChange(false);
                        navigate(`/drivers/${driver.id}`);
                    }}
                    disabled={updating}
                >
                    <ArrowUpRight size={16} />
                    <span>{t("fullView.button")}</span>
                </Button>
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
                    disabled={updating || selected === driver.status}
                    className="bg-main-primary hover:bg-main-primary/90 text-white font-bold h-11 px-10 common-rounded"
                >
                    {updating ? t("drivers:modal.saving") : t("drivers:modal.saveChanges")}
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

export default DriverDetailsModal;
