import { useEffect, useMemo, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { TFunction } from "i18next";
import { useTranslation } from "react-i18next";
import { CommonModal, CommonModalHeader, CommonModalBody, CommonModalFooter } from "@/shared/components/common/CommonModal";
import { CommonInput } from "@/shared/components/common/FormItems";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import useCommissionStore, { type ICommission } from "@/shared/hooks/store/useCommissionStore";
import { axiosRequestErrorMessage } from "@/shared/utils/networkErrors";

const createCommissionSchema = (t: TFunction<"commission">) =>
    z.object({
        category: z.enum(["trip", "storage", "advertising"]),
        type: z.enum(["fixed", "percentage"]),
        rate: z.number().min(0, t("validation.rateMin")),
        description: z.string().optional(),
        is_active: z.boolean(),
    });

type CommissionFormValues = z.infer<ReturnType<typeof createCommissionSchema>>;

interface CommissionModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    commission?: ICommission | null;
}

const CommissionModal = ({ open, onOpenChange, commission }: CommissionModalProps) => {
    const { t } = useTranslation(["commission", "common"]);
    const { commissions, createCommission, updateCommission, submitting, fetchCommissions, fetchAnalytics } = useCommissionStore();
    const [lastActiveError, setLastActiveError] = useState<string | null>(null);

    const schema = useMemo(() => createCommissionSchema(t), [t]);
    const resolver = useMemo(() => zodResolver(schema), [schema]);

    const { control, handleSubmit, reset } = useForm<CommissionFormValues>({
        resolver,
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
            setLastActiveError(null);
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
        if (commission && values.is_active === false && commission.is_active) {
            const activeInCategory = commissions.filter(
                (c) => c.category === commission.category && c.is_active && c.id !== commission.id
            );
            if (activeInCategory.length === 0) {
                setLastActiveError(
                    t("commission:modal.lastActiveError", {
                        category: t(`commission:categories.${commission.category}`),
                    })
                );
                return;
            }
        }
        setLastActiveError(null);
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
            if (import.meta.env.DEV) console.error("Failed to save commission", error);
            setLastActiveError(axiosRequestErrorMessage(error));
        }
    };

    return (
        <CommonModal open={open} onOpenChange={onOpenChange} maxWidth="sm:max-w-[480px]">
            <CommonModalHeader
                title={commission ? t("commission:modal.editTitle") : t("commission:modal.addTitle")}
                description={commission ? t("commission:modal.editDescription") : t("commission:modal.addDescription")}
            />
            <form onSubmit={handleSubmit(onSubmit)}>
                <CommonModalBody className="space-y-4">
                    <div>
                        <div className="flex items-center justify-between bg-main-titaniumWhite/30 p-4 common-rounded border border-main-whiteMarble/50 shadow-sm">
                            <div className="space-y-0.5">
                                <Label htmlFor="is_active" className="text-sm font-bold text-main-mirage">
                                    {t("commission:modal.activeLabel")}
                                </Label>
                                <p className="text-[10px] text-main-sharkGray">{t("commission:modal.activeHint")}</p>
                            </div>
                            <Controller
                                name="is_active"
                                control={control}
                                render={({ field }) => (
                                    <Switch
                                        id="is_active"
                                        checked={field.value}
                                        onCheckedChange={(v) => { field.onChange(v); setLastActiveError(null); }}
                                    />
                                )}
                            />
                        </div>
                        {lastActiveError && (
                            <p className="text-xs font-medium text-main-red mt-1">{lastActiveError}</p>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                    <Controller
                        name="category"
                        control={control}
                        render={({ field }) => (
                            <div className="space-y-1.5">
                                <Label className="text-sm font-semibold text-main-mirage">{t("commission:modal.category")}</Label>
                                <Select value={field.value} onValueChange={field.onChange}>
                                    <SelectTrigger className="h-11 common-rounded border-main-whiteMarble focus:ring-main-primary/30">
                                        <SelectValue placeholder={t("commission:modal.categoryPlaceholder")} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="trip">{t("commission:categories.trip")}</SelectItem>
                                        <SelectItem value="storage">{t("commission:categories.storage")}</SelectItem>
                                        <SelectItem value="advertising">{t("commission:categories.advertising")}</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        )}
                    />

                    <Controller
                        name="type"
                        control={control}
                        render={({ field }) => (
                            <div className="space-y-1.5">
                                <Label className="text-sm font-semibold text-main-mirage">{t("commission:modal.type")}</Label>
                                <Select value={field.value} onValueChange={field.onChange}>
                                    <SelectTrigger className="h-11 common-rounded border-main-whiteMarble focus:ring-main-primary/30">
                                        <SelectValue placeholder={t("commission:modal.typePlaceholder")} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="percentage">{t("commission:modal.typePercentage")}</SelectItem>
                                        <SelectItem value="fixed">{t("commission:modal.typeFixed")}</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        )}
                    />
                    </div>

                    <Controller
                        name="rate"
                        control={control}
                        render={({ field }) => (
                            <div className="space-y-1.5">
                                <Label className="text-sm font-semibold text-main-mirage">{t("commission:modal.rate")}</Label>
                                <Input
                                    type="number"
                                    min={0}
                                    step="0.01"
                                    placeholder={t("commission:modal.ratePlaceholder")}
                                    value={field.value ?? ""}
                                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                    onBlur={field.onBlur}
                                    className="h-11 border-main-whiteMarble focus-visible:ring-main-primary/30"
                                />
                            </div>
                        )}
                    />

                    <Controller
                        name="description"
                        control={control}
                        render={({ field }) => (
                            <CommonInput
                                label={t("commission:modal.description")}
                                placeholder={t("commission:modal.descriptionPlaceholder")}
                                type="textarea"
                                field={field as never}
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
                        {t("common:cancel")}
                    </Button>
                    <Button
                        type="submit"
                        disabled={submitting}
                        className="bg-main-primary hover:bg-main-primary/90 text-white font-bold h-11 px-10 common-rounded shadow-lg shadow-main-primary/20"
                    >
                        {submitting ? t("commission:modal.saving") : commission ? t("commission:modal.saveUpdate") : t("commission:modal.saveAdd")}
                    </Button>
                </CommonModalFooter>
            </form>
        </CommonModal>
    );
};

export default CommissionModal;
