import { useState } from "react";
import clsx from "clsx";
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
    const { updateStatus, updating } = useDriverStore();
    const [selected, setSelected] = useState<TDriverStatus>(driver?.status ?? "pending");

    const handleOpenChange = (v: boolean) => {
        if (v && driver) setSelected(driver.status);
        onOpenChange(v);
    };

    const handleSave = async () => {
        if (!driver) return;
        await updateStatus(driver.id, selected);
        onOpenChange(false);
    };

    if (!driver) return null;

    const displayName = driver.name ?? "Driver";
    const initials = displayName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

    const joinDate = new Date(driver.created_at).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
    });

    return (
        <CommonModal open={open} onOpenChange={handleOpenChange} loading={updating}>
            <CommonModalHeader
                title="Driver Details"
                description="View driver information and update their account status."
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
                    <InfoItem label="Phone" value={driver.phone} />
                    <InfoItem label="Joined" value={joinDate} />
                    <InfoItem label="Rating" value={driver.rating ? String(driver.rating) : "N/A"} />
                    <InfoItem label="Status" value={driverStatusStyles[driver.status].label} />
                </div>

                <div className="space-y-2">
                    <p className="text-sm font-semibold text-main-mirage">Account Status</p>
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
                                            {style.label}
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
                    Cancel
                </Button>
                <Button
                    onClick={handleSave}
                    disabled={updating || selected === driver.status}
                    className="bg-main-primary hover:bg-main-primary/90 text-white font-bold h-11 px-10 common-rounded"
                >
                    {updating ? "Saving…" : "Save Changes"}
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
