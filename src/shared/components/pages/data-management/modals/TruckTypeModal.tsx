import { useEffect, useMemo, useState } from "react";
import { useForm, Controller, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslation } from "react-i18next";
import {
    CommonModal,
    CommonModalHeader,
    CommonModalBody,
    CommonModalFooter,
} from "@/shared/components/common/CommonModal";
import { CommonInput } from "@/shared/components/common/FormItems";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import useDataManagementStore, { ITruckType } from "@/shared/hooks/store/useDataManagementStore";
import { axiosRequestErrorMessage } from "@/shared/utils/networkErrors";

type TruckTypeFormValues = {
    name: string;
    name_ar: string;
    description: string;
    capacity: number;
    capacity_unit: string;
    price_per_km: number;
    length_in_cm?: number;
    width_in_cm?: number;
    height_in_cm?: number;
    is_active: boolean;
};

interface TruckTypeModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    truckType?: ITruckType | null;
}

const TruckTypeModal = ({ open, onOpenChange, truckType }: TruckTypeModalProps) => {
    const { t } = useTranslation(["dataManagement", "common"]);
    const [requestError, setRequestError] = useState<string | null>(null);
    const { addTruckType, updateTruckType, submitting, fetchAnalytics, fetchTruckTypes } = useDataManagementStore();

    const truckTypeSchema = useMemo(
        () =>
            z.object({
                name: z.string().min(1, t("dataManagement:validation.nameRequired")),
                name_ar: z.string().min(1, t("dataManagement:validation.nameArRequired")),
                description: z.string().min(1, t("dataManagement:validation.descriptionRequired")),
                capacity: z.coerce.number().min(1, t("dataManagement:validation.capacityRequired")),
                capacity_unit: z.string().min(1, t("dataManagement:validation.unitRequired")),
                price_per_km: z.coerce.number().min(1, t("dataManagement:validation.priceRequired")),
                length_in_cm: z.coerce.number().optional(),
                width_in_cm: z.coerce.number().optional(),
                height_in_cm: z.coerce.number().optional(),
                is_active: z.boolean(),
            }),
        [t],
    );

    const { control, handleSubmit, reset } = useForm<TruckTypeFormValues>({
        resolver: zodResolver(truckTypeSchema) as Resolver<TruckTypeFormValues>,
        defaultValues: {
            name: "",
            name_ar: "",
            description: "",
            capacity: 0,
            capacity_unit: "kg",
            price_per_km: 0,
            is_active: true,
        },
    });

    useEffect(() => {
        if (!open) return;
        setRequestError(null);
        if (truckType) {
            reset({
                name: truckType.name,
                name_ar: truckType.name_ar || "",
                description: truckType.description || "",
                capacity: truckType.capacity || 0,
                capacity_unit: truckType.capacity_unit || "kg",
                price_per_km: Number(truckType.price_per_km) || 0,
                length_in_cm: truckType.length_in_cm || undefined,
                width_in_cm: truckType.width_in_cm || undefined,
                height_in_cm: truckType.height_in_cm || undefined,
                is_active: truckType.is_active,
            });
        } else {
            reset({
                name: "",
                name_ar: "",
                description: "",
                capacity: 0,
                capacity_unit: "kg",
                price_per_km: 0,
                is_active: true,
            });
        }
    }, [open, truckType, reset]);

    const onSubmit = async (values: TruckTypeFormValues) => {
        setRequestError(null);
        try {
            if (truckType) {
                await updateTruckType(truckType.id, values);
            } else {
                await addTruckType(values);
            }
            fetchTruckTypes();
            fetchAnalytics();
            onOpenChange(false);
        } catch (error) {
            if (import.meta.env.DEV) console.error("Failed to save truck type", error);
            setRequestError(axiosRequestErrorMessage(error));
        }
    };

    return (
        <CommonModal open={open} onOpenChange={onOpenChange} maxWidth="sm:max-w-[500px]">
            <CommonModalHeader
                title={truckType ? t("dataManagement:truckModal.editTitle") : t("dataManagement:truckModal.addTitle")}
                description={
                    truckType ? t("dataManagement:truckModal.editDescription") : t("dataManagement:truckModal.addDescription")
                }
            />
            <form onSubmit={handleSubmit(onSubmit)}>
                <CommonModalBody className="space-y-4">
                    {requestError ? (
                        <p className="text-xs font-medium text-main-red" role="alert">
                            {requestError}
                        </p>
                    ) : null}
                    <div className="flex items-center justify-between bg-main-titaniumWhite/30 p-4 common-rounded border border-main-whiteMarble/50 shadow-sm">
                        <div className="space-y-0.5 min-w-0 pe-3">
                            <Label htmlFor="is_active" className="text-sm font-bold text-main-mirage">
                                {t("dataManagement:truckModal.activeLabel")}
                            </Label>
                            <p className="text-[10px] text-main-sharkGray">{t("dataManagement:truckModal.activeHint")}</p>
                        </div>
                        <Controller
                            name="is_active"
                            control={control}
                            render={({ field }) => (
                                <Switch id="is_active" checked={field.value} onCheckedChange={field.onChange} />
                            )}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Controller
                            name="name"
                            control={control}
                            render={({ field }) => (
                                <CommonInput
                                    label={t("dataManagement:truckModal.nameEn")}
                                    placeholder={t("dataManagement:truckModal.nameEnPlaceholder")}
                                    field={field}
                                />
                            )}
                        />
                        <Controller
                            name="name_ar"
                            control={control}
                            render={({ field }) => (
                                <div dir="rtl" className="text-right">
                                    <CommonInput
                                        label={t("dataManagement:truckModal.nameAr")}
                                        placeholder={t("dataManagement:truckModal.nameArPlaceholder")}
                                        field={field}
                                    />
                                </div>
                            )}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Controller
                            name="capacity"
                            control={control}
                            render={({ field }) => (
                                <CommonInput
                                    label={t("dataManagement:truckModal.capacity")}
                                    placeholder={t("dataManagement:truckModal.capacityPlaceholder")}
                                    field={field}
                                />
                            )}
                        />
                        <Controller
                            name="capacity_unit"
                            control={control}
                            render={({ field }) => (
                                <CommonInput
                                    label={t("dataManagement:truckModal.unit")}
                                    placeholder={t("dataManagement:truckModal.unitPlaceholder")}
                                    field={field}
                                />
                            )}
                        />
                    </div>

                    <Controller
                        name="price_per_km"
                        control={control}
                        render={({ field }) => (
                            <CommonInput
                                label={t("dataManagement:truckModal.pricePerKm")}
                                placeholder={t("dataManagement:truckModal.pricePerKmPlaceholder")}
                                field={field}
                            />
                        )}
                    />

                    <Controller
                        name="description"
                        control={control}
                        render={({ field }) => (
                            <CommonInput
                                label={t("dataManagement:truckModal.description")}
                                placeholder={t("dataManagement:truckModal.descriptionPlaceholder")}
                                type="textarea"
                                field={field}
                            />
                        )}
                    />

                    <div className="grid grid-cols-3 gap-3">
                        <Controller
                            name="length_in_cm"
                            control={control}
                            render={({ field }) => (
                                <CommonInput
                                    label={t("dataManagement:truckModal.lengthCm")}
                                    placeholder={t("dataManagement:truckModal.lengthPlaceholder")}
                                    field={field}
                                />
                            )}
                        />
                        <Controller
                            name="width_in_cm"
                            control={control}
                            render={({ field }) => (
                                <CommonInput
                                    label={t("dataManagement:truckModal.widthCm")}
                                    placeholder={t("dataManagement:truckModal.widthPlaceholder")}
                                    field={field}
                                />
                            )}
                        />
                        <Controller
                            name="height_in_cm"
                            control={control}
                            render={({ field }) => (
                                <CommonInput
                                    label={t("dataManagement:truckModal.heightCm")}
                                    placeholder={t("dataManagement:truckModal.heightPlaceholder")}
                                    field={field}
                                />
                            )}
                        />
                    </div>
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
                        className="bg-main-primary hover:bg-main-primary/90 text-white font-bold h-11 px-10 common-rounded"
                    >
                        {submitting
                            ? t("dataManagement:truckModal.saving")
                            : truckType
                              ? t("dataManagement:truckModal.saveUpdate")
                              : t("dataManagement:truckModal.saveAdd")}
                    </Button>
                </CommonModalFooter>
            </form>
        </CommonModal>
    );
};

export default TruckTypeModal;
