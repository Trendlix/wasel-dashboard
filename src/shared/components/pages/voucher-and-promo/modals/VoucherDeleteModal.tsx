import { Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  CommonModal,
  CommonModalBody,
  CommonModalFooter,
} from "@/shared/components/common/CommonModal";
import type { IVoucher } from "@/shared/hooks/store/useVoucherStore";

interface VoucherDeleteModalProps {
  open: boolean;
  voucher: IVoucher | null;
  loading: boolean;
  onOpenChange: (value: boolean) => void;
  onConfirm: () => Promise<void>;
}

const VoucherDeleteModal = ({
  open,
  voucher,
  loading,
  onOpenChange,
  onConfirm,
}: VoucherDeleteModalProps) => {
  const { t } = useTranslation(["voucher", "common"]);

  const handleConfirm = async () => {
    await onConfirm();
    onOpenChange(false);
  };

  return (
    <CommonModal open={open} onOpenChange={onOpenChange} loading={loading} maxWidth="sm:max-w-[420px]" variant="danger">
      <CommonModalBody className="flex flex-col items-center text-center space-y-4 pt-6 pb-2">
        <div className="w-16 h-16 bg-main-remove/10 rounded-2xl flex items-center justify-center ring-8 ring-main-remove/5">
          <Trash2 className="w-8 h-8 text-main-remove" />
        </div>
        <div className="space-y-1.5 max-w-[300px]">
          <p className="text-xl font-bold text-main-mirage tracking-tight">{t("voucher:delete.title")}</p>
          <p className="text-sm text-main-sharkGray leading-relaxed">
            {t("voucher:delete.description", { code: voucher?.code ?? "—" })}
          </p>
        </div>
      </CommonModalBody>
      <CommonModalFooter className="justify-center gap-3 mt-2">
        <Button
          type="button"
          variant="ghost"
          onClick={() => onOpenChange(false)}
          disabled={loading}
          className="h-11 px-6 text-main-sharkGray hover:bg-main-titaniumWhite font-semibold common-rounded"
        >
          {t("common:cancel")}
        </Button>
        <Button
          type="button"
          onClick={handleConfirm}
          disabled={loading}
          className="h-11 px-10 bg-main-remove hover:bg-main-remove/90 text-white font-bold common-rounded shadow-lg shadow-main-remove/20"
        >
          {loading ? t("voucher:delete.deleting") : t("voucher:delete.confirm")}
        </Button>
      </CommonModalFooter>
    </CommonModal>
  );
};

export default VoucherDeleteModal;
