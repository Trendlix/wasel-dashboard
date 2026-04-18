import { Button } from "@/components/ui/button";
import {
  CommonModal,
  CommonModalBody,
  CommonModalFooter,
  CommonModalHeader,
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
  const handleConfirm = async () => {
    await onConfirm();
    onOpenChange(false);
  };

  return (
    <CommonModal open={open} onOpenChange={onOpenChange} loading={loading} maxWidth="sm:max-w-[460px]">
      <CommonModalHeader title="Delete Voucher" description="This action cannot be undone." />
      <CommonModalBody>
        <p className="text-sm text-main-sharkGray">
          You are about to delete voucher
          <span className="font-semibold text-main-mirage"> {voucher?.code}</span> permanently.
        </p>
      </CommonModalBody>
      <CommonModalFooter>
        <Button
          type="button"
          variant="ghost"
          onClick={() => onOpenChange(false)}
          disabled={loading}
          className="h-11 px-6 text-main-sharkGray hover:bg-main-titaniumWhite"
        >
          Cancel
        </Button>
        <Button
          type="button"
          onClick={handleConfirm}
          disabled={loading}
          className="h-11 px-10 bg-main-remove hover:bg-main-remove/90 text-white"
        >
          {loading ? "Deleting..." : "Delete"}
        </Button>
      </CommonModalFooter>
    </CommonModal>
  );
};

export default VoucherDeleteModal;
