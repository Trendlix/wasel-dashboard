import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { CalendarRange, FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    CommonModal,
    CommonModalBody,
    CommonModalFooter,
    CommonModalHeader,
} from "@/shared/components/common/CommonModal";

interface UsersExportModalProps {
    open: boolean;
    loading: boolean;
    initialDateFrom?: string;
    initialDateTo?: string;
    onOpenChange: (value: boolean) => void;
    onConfirm: (payload: { date_from?: string; date_to?: string }) => Promise<void>;
}

const UsersExportModal = ({
    open,
    loading,
    initialDateFrom,
    initialDateTo,
    onOpenChange,
    onConfirm,
}: UsersExportModalProps) => {
    const { t } = useTranslation(["users", "common"]);
    const [dateFrom, setDateFrom] = useState(initialDateFrom ?? "");
    const [dateTo, setDateTo] = useState(initialDateTo ?? "");
    const now = new Date();
    const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

    useEffect(() => {
        if (open) {
            setDateFrom(initialDateFrom ?? "");
            setDateTo(initialDateTo ?? "");
        }
    }, [open, initialDateFrom, initialDateTo]);

    const handleConfirm = async () => {
        await onConfirm({
            date_from: dateFrom || undefined,
            date_to: dateTo || undefined,
        });
        onOpenChange(false);
    };

    const hasInvalidRange = Boolean(dateFrom && dateTo && dateFrom > dateTo);
    const hasFutureDate = Boolean((dateFrom && dateFrom > today) || (dateTo && dateTo > today));
    const disableConfirm = loading || hasInvalidRange || hasFutureDate;

    return (
        <CommonModal open={open} onOpenChange={onOpenChange} loading={loading} maxWidth="sm:max-w-[520px]">
            <CommonModalHeader
                title={t("users:export.title")}
                description={t("users:export.description")}
            />

            <CommonModalBody className="space-y-4">
                <div className="flex items-center gap-3 px-4 py-3 bg-main-primary/5 border border-main-primary/15 rounded-xl">
                    <div className="w-9 h-9 bg-main-primary/10 rounded-lg flex items-center justify-center shrink-0">
                        <CalendarRange className="w-4 h-4 text-main-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-main-mirage">{t("common:exportDateRange.title")}</p>
                        <p className="text-xs text-main-sharkGray">{t("users:export.dateHint")}</p>
                    </div>
                    <FileDown className="w-4 h-4 text-main-primary/50 ms-auto shrink-0" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <p className="text-sm font-semibold text-main-mirage">{t("common:exportDateRange.from")}</p>
                        <Input
                            type="date"
                            value={dateFrom}
                            onChange={(e) => setDateFrom(e.target.value)}
                            max={today}
                            className="h-11 border-main-whiteMarble common-rounded focus-visible:ring-main-primary/30"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <p className="text-sm font-semibold text-main-mirage">{t("common:exportDateRange.to")}</p>
                        <Input
                            type="date"
                            value={dateTo}
                            onChange={(e) => setDateTo(e.target.value)}
                            min={dateFrom || undefined}
                            max={today}
                            className="h-11 border-main-whiteMarble common-rounded focus-visible:ring-main-primary/30"
                        />
                    </div>
                </div>
                {(hasInvalidRange || hasFutureDate) && (
                    <p className="text-xs font-medium text-main-red mt-1">
                        {hasInvalidRange
                            ? t("common:exportDateRange.invalidRange")
                            : t("common:exportDateRange.futureDate")}
                    </p>
                )}
            </CommonModalBody>

            <CommonModalFooter>
                <Button
                    type="button"
                    variant="ghost"
                    className="text-main-sharkGray hover:text-main-mirage hover:bg-main-titaniumWhite px-6 h-11 common-rounded font-semibold"
                    onClick={() => onOpenChange(false)}
                    disabled={loading}
                >
                    {t("common:cancel")}
                </Button>
                <Button
                    onClick={handleConfirm}
                    disabled={disableConfirm}
                    className="bg-main-primary hover:bg-main-primary/90 text-white font-bold h-11 px-10 common-rounded shadow-lg shadow-main-primary/20 inline-flex items-center gap-2"
                >
                    <FileDown className="w-4 h-4" />
                    {loading ? t("common:exporting") : t("common:export")}
                </Button>
            </CommonModalFooter>
        </CommonModal>
    );
};

export default UsersExportModal;
