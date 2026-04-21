import { CheckCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  CommonModal,
  CommonModalBody,
  CommonModalFooter,
} from "@/shared/components/common/CommonModal";
import type { IVoucher } from "@/shared/hooks/store/useVoucherStore";

interface VoucherEnableModalProps {
  open: boolean;
  voucher: IVoucher | null;
  loading: boolean;
  onOpenChange: (value: boolean) => void;
  onConfirm: () => Promise<void>;
}

const VoucherEnableModal = ({
  open,
  voucher,
  loading,
  onOpenChange,
  onConfirm,
}: VoucherEnableModalProps) => {
  const { t } = useTranslation("voucher");

  const handleConfirm = async () => {
    await onConfirm();
    onOpenChange(false);
  };

  return (
    <CommonModal
      open={open}
      onOpenChange={onOpenChange}
      loading={loading}
      maxWidth="sm:max-w-[420px]"
      variant="success"
    >
      <CommonModalBody className="flex flex-col items-center text-center space-y-4 pt-6 pb-2">
        <div className="w-16 h-16 bg-main-vividMint/10 rounded-2xl flex items-center justify-center ring-8 ring-main-vividMint/5">
          <CheckCircle className="w-8 h-8 text-main-vividMint" />
        </div>
        <div className="space-y-1.5 max-w-[300px]">
          <p className="text-xl font-bold text-main-mirage tracking-tight">{t("enableModal.title")}</p>
          <p className="text-sm text-main-sharkGray leading-relaxed">
            {t("enableModal.description", { code: voucher?.code ?? "—" })}
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
          {t("enableModal.cancel")}
        </Button>
        <Button
          type="button"
          onClick={handleConfirm}
          disabled={loading}
          className="h-11 px-10 bg-main-vividMint hover:bg-main-vividMint/90 text-white font-bold common-rounded shadow-lg shadow-main-vividMint/20"
        >
          {loading ? t("enableModal.confirmLoading") : t("enableModal.confirm")}
        </Button>
      </CommonModalFooter>
    </CommonModal>
  );
};

export default VoucherEnableModal;
