import { CircleOff } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  CommonModal,
  CommonModalBody,
  CommonModalFooter,
} from "@/shared/components/common/CommonModal";
import type { IVoucher } from "@/shared/hooks/store/useVoucherStore";

interface VoucherDisableModalProps {
  open: boolean;
  voucher: IVoucher | null;
  loading: boolean;
  onOpenChange: (value: boolean) => void;
  onConfirm: () => Promise<void>;
}

const VoucherDisableModal = ({
  open,
  voucher,
  loading,
  onOpenChange,
  onConfirm,
}: VoucherDisableModalProps) => {
  const { t } = useTranslation("voucher");

  const handleConfirm = async () => {
    await onConfirm();
    onOpenChange(false);
  };

  return (
    <CommonModal open={open} onOpenChange={onOpenChange} loading={loading} maxWidth="sm:max-w-[420px]">
      <CommonModalBody className="flex flex-col items-center text-center space-y-4 pt-6 pb-2">
        <div className="w-16 h-16 bg-main-primary/10 rounded-2xl flex items-center justify-center ring-8 ring-main-primary/5">
          <CircleOff className="w-8 h-8 text-main-primary" />
        </div>
        <div className="space-y-1.5 max-w-[300px]">
          <p className="text-xl font-bold text-main-mirage tracking-tight">{t("disableModal.title")}</p>
          <p className="text-sm text-main-sharkGray leading-relaxed">
            {t("disableModal.description", { code: voucher?.code ?? "—" })}
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
          {t("disableModal.cancel")}
        </Button>
        <Button
          type="button"
          onClick={handleConfirm}
          disabled={loading}
          className="h-11 px-10 bg-main-primary hover:bg-main-primary/90 text-white font-bold common-rounded shadow-lg shadow-main-primary/20"
        >
          {loading ? t("disableModal.confirmLoading") : t("disableModal.confirm")}
        </Button>
      </CommonModalFooter>
    </CommonModal>
  );
};

export default VoucherDisableModal;
