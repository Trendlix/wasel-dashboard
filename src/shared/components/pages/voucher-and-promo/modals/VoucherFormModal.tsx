import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Info, WandSparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CommonModal,
  CommonModalBody,
  CommonModalFooter,
  CommonModalHeader,
} from "@/shared/components/common/CommonModal";
import useVoucherStore, {
  type IVoucher,
  type IVoucherPayload,
  type TVoucherDiscountType,
  type TVoucherStatus,
} from "@/shared/hooks/store/useVoucherStore";

const voucherSchema = z
  .object({
    code: z.string().min(3, "Code must be at least 3 characters").max(50, "Code is too long"),
    description: z.string().optional(),
    discount_type: z.enum(["fixed", "percentage"]),
    discount_value: z.number().min(0, "Discount value must be >= 0"),
    min_order: z.number().min(0).optional(),
    max_discount: z.number().min(0).optional(),
    usage_limit: z.number().int().min(1).optional(),
    usage_per_user: z.number().int().min(0, "Usage per user must be >= 0"),
    valid_from: z.string().min(1, "Valid from is required"),
    valid_to: z.string().min(1, "Valid to is required"),
    status: z.enum(["active", "inactive", "suspended", "expired"]),
  })
  .refine((data) => data.valid_to > data.valid_from, {
    message: "Valid to must be after valid from",
    path: ["valid_to"],
  });

type VoucherFormValues = z.infer<typeof voucherSchema>;

interface VoucherFormModalProps {
  open: boolean;
  voucher?: IVoucher | null;
  onOpenChange: (value: boolean) => void;
  onSaved: () => Promise<void>;
}

const toDateInput = (value: string | Date) => {
  const date = value instanceof Date ? value : new Date(value);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const VoucherFormModal = ({ open, voucher, onOpenChange, onSaved }: VoucherFormModalProps) => {
  const { createVoucher, updateVoucher, generateVoucherCode, submitting } = useVoucherStore();

  const { control, handleSubmit, reset, setValue } = useForm<VoucherFormValues>({
    resolver: zodResolver(voucherSchema),
    defaultValues: {
      code: "",
      description: "",
      discount_type: "percentage",
      discount_value: 0,
      min_order: undefined,
      max_discount: undefined,
      usage_limit: undefined,
      usage_per_user: 1,
      valid_from: "",
      valid_to: "",
      status: "active",
    },
  });

  useEffect(() => {
    if (!open) return;

    if (voucher) {
      reset({
        code: voucher.code,
        description: voucher.description ?? "",
        discount_type: voucher.discount_type,
        discount_value: Number(voucher.discount_value),
        min_order: voucher.min_order ?? undefined,
        max_discount: voucher.max_discount ?? undefined,
        usage_limit: voucher.usage_limit ?? undefined,
        usage_per_user: voucher.usage_per_user,
        valid_from: toDateInput(voucher.valid_from),
        valid_to: toDateInput(voucher.valid_to),
        status: voucher.status,
      });
    } else {
      reset({
        code: "",
        description: "",
        discount_type: "percentage",
        discount_value: 0,
        min_order: undefined,
        max_discount: undefined,
        usage_limit: undefined,
        usage_per_user: 1,
        valid_from: "",
        valid_to: "",
        status: "active",
      });
    }
  }, [open, voucher, reset]);

  const submit = async (values: VoucherFormValues) => {
    const payload: IVoucherPayload = {
      code: values.code.trim(),
      description: values.description?.trim() || undefined,
      discount_type: values.discount_type as TVoucherDiscountType,
      discount_value: Number(values.discount_value),
      min_order: values.min_order,
      max_discount: values.max_discount,
      usage_limit: values.usage_limit,
      usage_per_user: Number(values.usage_per_user),
      valid_from: values.valid_from,
      valid_to: values.valid_to,
      status: values.status as TVoucherStatus,
    };

    if (voucher) {
      await updateVoucher(voucher.id, payload);
    } else {
      await createVoucher(payload);
    }

    await onSaved();
    onOpenChange(false);
  };

  const handleGenerateCode = async () => {
    const code = await generateVoucherCode();
    setValue("code", code, { shouldDirty: true, shouldValidate: true });
  };

  return (
    <CommonModal open={open} onOpenChange={onOpenChange} loading={submitting} maxWidth="sm:max-w-[720px]">
      <CommonModalHeader
        title={voucher ? "Edit Voucher" : "Add Voucher"}
        description={voucher ? "Update voucher details" : "Create a new voucher for your customers"}
      />
      <form onSubmit={handleSubmit(submit)}>
        <CommonModalBody className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Controller
              name="code"
              control={control}
              render={({ field, fieldState }) => (
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <Label>Code</Label>
                    <div className="relative group">
                      <Info className="size-3.5 text-main-sharkGray" />
                      <div className="pointer-events-none absolute left-1/2 top-full z-20 mt-1 w-max -translate-x-1/2 rounded-md bg-main-mirage px-2 py-1 text-[11px] text-main-white opacity-0 shadow-md transition-opacity group-hover:opacity-100">
                        Click to generate code
                      </div>
                    </div>
                  </div>
                  <div className="relative">
                    <Input {...field} placeholder="WELCOME10" className="h-11 border-main-whiteMarble pr-11" />
                    <button
                      type="button"
                      onClick={handleGenerateCode}
                      className="absolute right-1 top-1/2 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-main-primary hover:bg-main-primary/10 transition-colors"
                      title="Click to generate code"
                    >
                      <WandSparkles className="size-4" />
                    </button>
                  </div>
                  {fieldState.error && <p className="text-xs text-main-remove">{fieldState.error.message}</p>}
                </div>
              )}
            />

            <Controller
              name="discount_type"
              control={control}
              render={({ field }) => (
                <div className="space-y-1.5">
                  <Label>Discount Type</Label>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="h-11 border-main-whiteMarble">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Percentage</SelectItem>
                      <SelectItem value="fixed">Fixed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            />

            <Controller
              name="discount_value"
              control={control}
              render={({ field, fieldState }) => (
                <div className="space-y-1.5">
                  <Label>Discount Value</Label>
                  <Input
                    type="number"
                    min={0}
                    step="0.01"
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(Number(e.target.value || 0))}
                    className="h-11 border-main-whiteMarble"
                  />
                  {fieldState.error && <p className="text-xs text-main-remove">{fieldState.error.message}</p>}
                </div>
              )}
            />

            <Controller
              name="usage_per_user"
              control={control}
              render={({ field, fieldState }) => (
                <div className="space-y-1.5">
                  <Label>Usage Per User</Label>
                  <Input
                    type="number"
                    min={0}
                    step="1"
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(Number(e.target.value || 0))}
                    className="h-11 border-main-whiteMarble"
                  />
                  {fieldState.error && <p className="text-xs text-main-remove">{fieldState.error.message}</p>}
                </div>
              )}
            />

            <Controller
              name="usage_limit"
              control={control}
              render={({ field }) => (
                <div className="space-y-1.5">
                  <Label>Usage Limit (Optional)</Label>
                  <Input
                    type="number"
                    min={1}
                    step="1"
                    value={field.value ?? ""}
                    onChange={(e) =>
                      setValue("usage_limit", e.target.value === "" ? undefined : Number(e.target.value))
                    }
                    className="h-11 border-main-whiteMarble"
                  />
                </div>
              )}
            />

            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <div className="space-y-1.5">
                  <Label>Status</Label>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="h-11 border-main-whiteMarble">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="suspended">Suspended</SelectItem>
                      <SelectItem value="expired">Expired</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            />

            <Controller
              name="valid_from"
              control={control}
              render={({ field, fieldState }) => (
                <div className="space-y-1.5">
                  <Label>Valid From</Label>
                  <Input type="date" {...field} className="h-11 border-main-whiteMarble" />
                  {fieldState.error && <p className="text-xs text-main-remove">{fieldState.error.message}</p>}
                </div>
              )}
            />

            <Controller
              name="valid_to"
              control={control}
              render={({ field, fieldState }) => (
                <div className="space-y-1.5">
                  <Label>Valid To</Label>
                  <Input type="date" {...field} className="h-11 border-main-whiteMarble" />
                  {fieldState.error && <p className="text-xs text-main-remove">{fieldState.error.message}</p>}
                </div>
              )}
            />
          </div>

          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <div className="space-y-1.5">
                <Label>Description (Optional)</Label>
                <Textarea {...field} placeholder="Brief voucher description" className="min-h-28 border-main-whiteMarble" />
              </div>
            )}
          />
        </CommonModalBody>

        <CommonModalFooter>
          <Button
            type="button"
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="h-11 px-6 text-main-sharkGray hover:bg-main-titaniumWhite"
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="h-11 px-10 bg-main-primary hover:bg-main-primary/90 text-white"
            disabled={submitting}
          >
            {submitting ? "Saving..." : voucher ? "Update" : "Create"}
          </Button>
        </CommonModalFooter>
      </form>
    </CommonModal>
  );
};

export default VoucherFormModal;
