import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  CommonModal,
  CommonModalBody,
  CommonModalFooter,
  CommonModalHeader,
} from "@/shared/components/common/CommonModal";

interface TripsExportModalProps {
  open: boolean;
  loading: boolean;
  initialDateFrom?: string;
  initialDateTo?: string;
  onOpenChange: (value: boolean) => void;
  onConfirm: (payload: { date_from?: string; date_to?: string }) => Promise<void>;
}

const TripsExportModal = ({
  open,
  loading,
  initialDateFrom,
  initialDateTo,
  onOpenChange,
  onConfirm,
}: TripsExportModalProps) => {
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
  const hasFutureDate = Boolean(
    (dateFrom && dateFrom > today) || (dateTo && dateTo > today),
  );
  const disableConfirm = loading || hasInvalidRange || hasFutureDate;

  return (
    <CommonModal open={open} onOpenChange={onOpenChange} loading={loading} maxWidth="sm:max-w-[520px]">
      <CommonModalHeader
        title="Export Trips"
        description="Choose a date range if you want to export trips for a specific period."
      />

      <CommonModalBody className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <p className="text-sm font-semibold text-main-mirage">From</p>
            <Input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              max={today}
              className="h-11 border border-main-whiteMarble common-rounded"
            />
          </div>

          <div className="space-y-2">
            <p className="text-sm font-semibold text-main-mirage">To</p>
            <Input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              min={dateFrom || undefined}
              max={today}
              className="h-11 border border-main-whiteMarble common-rounded"
            />
          </div>
        </div>
        {(hasInvalidRange || hasFutureDate) && (
          <p className="text-xs text-main-remove">
            {hasInvalidRange
              ? "From date must be before or equal to To date."
              : "Date range cannot exceed today."}
          </p>
        )}
      </CommonModalBody>

      <CommonModalFooter>
        <Button
          type="button"
          variant="ghost"
          className="text-main-sharkGray hover:text-main-mirage hover:bg-main-titaniumWhite px-6 h-11 common-rounded"
          onClick={() => onOpenChange(false)}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          onClick={handleConfirm}
          disabled={disableConfirm}
          className="bg-main-primary hover:bg-main-primary/90 text-white font-bold h-11 px-10 common-rounded"
        >
          {loading ? "Exporting..." : "Confirm Export"}
        </Button>
      </CommonModalFooter>
    </CommonModal>
  );
};

export default TripsExportModal;
