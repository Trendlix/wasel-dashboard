import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CommonModal, CommonModalHeader, CommonModalBody, CommonModalFooter } from "@/shared/components/common/CommonModal";
import { CommonInput } from "@/shared/components/common/FormItems";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import useCommissionStore, { type ICommission } from "@/shared/hooks/store/useCommissionStore";

const commissionSchema = z.object({
    category: z.enum(["trip", "storage", "advertising"]),
    type: z.enum(["fixed", "percentage"]),
    rate: z.number().min(0, "Rate must be at least 0"),
    description: z.string().optional(),
    is_active: z.boolean(),
});

type CommissionFormValues = z.infer<typeof commissionSchema>;

interface CommissionModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    commission?: ICommission | null;
}

const CommissionModal = ({ open, onOpenChange, commission }: CommissionModalProps) => {
    const { createCommission, updateCommission, submitting, fetchCommissions, fetchAnalytics } = useCommissionStore();

    const { control, handleSubmit, reset } = useForm<CommissionFormValues>({
        resolver: zodResolver(commissionSchema),
        defaultValues: {
            category: "trip",
            type: "percentage",
            rate: 0,
            description: "",
            is_active: true,
        },
    });

    useEffect(() => {
        if (open) {
            if (commission) {
                reset({
                    category: commission.category,
                    type: commission.type,
                    rate: commission.rate,
                    description: commission.description ?? "",
                    is_active: commission.is_active,
                });
            } else {
                reset({ category: "trip", type: "percentage", rate: 0, description: "", is_active: true });
            }
        }
    }, [open, commission, reset]);

    const onSubmit = async (values: CommissionFormValues) => {
        try {
            if (commission) {
                await updateCommission(commission.id, values);
            } else {
                await createCommission(values);
            }
            fetchCommissions();
            fetchAnalytics();
            onOpenChange(false);
        } catch (error) {
            console.error("Failed to save commission", error);
        }
    };

    return (
        <CommonModal open={open} onOpenChange={onOpenChange} maxWidth="sm:max-w-[480px]">
            <CommonModalHeader
                title={commission ? "Edit Commission Rate" : "Add Commission Rate"}
                description={commission ? "Update the commission rule" : "Create a new commission rate for the platform"}
            />
            <form onSubmit={handleSubmit(onSubmit as any)}>
                <CommonModalBody className="space-y-4">
                    {/* Active Status Toggle */}
                    <div className="flex items-center justify-between bg-main-titaniumWhite/30 p-4 common-rounded border border-main-whiteMarble/50 shadow-sm">
                        <div className="space-y-0.5">
                            <Label htmlFor="is_active" className="text-sm font-bold text-main-mirage">
                                Active Status
                            </Label>
                            <p className="text-[10px] text-main-sharkGray">Toggle to enable or disable this commission rate</p>
                        </div>
                        <Controller
                            name="is_active"
                            control={control}
                            render={({ field }) => (
                                <Switch
                                    id="is_active"
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            )}
                        />
                    </div>

                    {/* Category */}
                    <Controller
                        name="category"
                        control={control}
                        render={({ field }) => (
                            <div className="space-y-1.5">
                                <Label className="text-sm font-medium text-main-sharkGray">Category</Label>
                                <Select value={field.value} onValueChange={field.onChange}>
                                    <SelectTrigger className="h-11 common-rounded border-main-whiteMarble">
                                        <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="trip">Trips</SelectItem>
                                        <SelectItem value="storage">Storage</SelectItem>
                                        <SelectItem value="advertising">Advertising</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        )}
                    />

                    {/* Type */}
                    <Controller
                        name="type"
                        control={control}
                        render={({ field }) => (
                            <div className="space-y-1.5">
                                <Label className="text-sm font-medium text-main-sharkGray">Type</Label>
                                <Select value={field.value} onValueChange={field.onChange}>
                                    <SelectTrigger className="h-11 common-rounded border-main-whiteMarble">
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="percentage">Percentage (%)</SelectItem>
                                        <SelectItem value="fixed">Fixed Amount</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        )}
                    />

                    {/* Rate */}
                    <Controller
                        name="rate"
                        control={control}
                        render={({ field }) => (
                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-main-sharkGray">Rate</Label>
                                <input
                                    type="number"
                                    min={0}
                                    step="0.01"
                                    placeholder="e.g. 15"
                                    value={field.value ?? ""}
                                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                    onBlur={field.onBlur}
                                    className="w-full h-11 px-4 border border-main-whiteMarble common-rounded text-sm text-main-mirage outline-none focus:border-main-primary transition-colors bg-transparent"
                                />
                            </div>
                        )}
                    />

                    {/* Description */}
                    <Controller
                        name="description"
                        control={control}
                        render={({ field }) => (
                            <CommonInput
                                label="Description (optional)"
                                placeholder="e.g. Standard trip commission"
                                type="textarea"
                                field={field as any}
                            />
                        )}
                    />
                </CommonModalBody>
                <CommonModalFooter>
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={() => onOpenChange(false)}
                        className="font-bold text-main-sharkGray h-11 px-6 common-rounded hover:bg-main-titaniumWhite"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        disabled={submitting}
                        className="bg-main-primary hover:bg-main-primary/90 text-white font-bold h-11 px-10 common-rounded shadow-lg shadow-main-primary/20"
                    >
                        {submitting ? "Saving..." : commission ? "Update" : "Add"}
                    </Button>
                </CommonModalFooter>
            </form>
        </CommonModal>
    );
};

export default CommissionModal;
