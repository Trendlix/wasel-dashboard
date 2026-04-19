import { useEffect, useMemo, useState } from "react";
import { useForm, Controller, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslation } from "react-i18next";
import { Check } from "lucide-react";
import clsx from "clsx";
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
import useDataManagementStore, { IGoodsType } from "@/shared/hooks/store/useDataManagementStore";
import { axiosRequestErrorMessage } from "@/shared/utils/networkErrors";

type GoodsTypeFormValues = {
    name: string;
    name_ar: string;
    description: string;
    value: string;
    truck_type_ids: number[];
    is_active: boolean;
};

interface GoodsTypeModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    goodsType?: IGoodsType | null;
}

const GoodsTypeModal = ({ open, onOpenChange, goodsType }: GoodsTypeModalProps) => {
    const { t } = useTranslation(["dataManagement", "common"]);
    const [requestError, setRequestError] = useState<string | null>(null);
    const { truckTypes, fetchTruckTypes, addGoodType, updateGoodType, submitting, fetchAnalytics, fetchGoodTypes } =
        useDataManagementStore();

    const goodsTypeSchema = useMemo(
        () =>
            z.object({
                name: z.string().min(1, t("dataManagement:validation.nameRequired")),
                name_ar: z.string().min(1, t("dataManagement:validation.nameArRequired")),
                description: z.string().min(1, t("dataManagement:validation.descriptionRequired")),
                value: z.string().min(1, t("dataManagement:validation.valueRequired")),
                truck_type_ids: z.array(z.number()).min(1, t("dataManagement:validation.truckTypesMin")),
                is_active: z.boolean(),
            }),
        [t],
    );

    const { control, handleSubmit, reset, setValue, watch } = useForm<GoodsTypeFormValues>({
        resolver: zodResolver(goodsTypeSchema) as Resolver<GoodsTypeFormValues>,
        defaultValues: {
            name: "",
            name_ar: "",
            description: "",
            value: "",
            truck_type_ids: [],
            is_active: true,
        },
    });

    useEffect(() => {
        if (!open) return;
        setRequestError(null);
        fetchTruckTypes(1, 100);
        if (goodsType) {
            reset({
                name: goodsType.name,
                name_ar: goodsType.name_ar || "",
                description: goodsType.description,
                value: goodsType.value,
                truck_type_ids: goodsType.truckTypeGoods.map((tg) => tg.truck_type_id),
                is_active: goodsType.is_active,
            });
        } else {
            reset({
                name: "",
                name_ar: "",
                description: "",
                value: "",
                truck_type_ids: [],
                is_active: true,
            });
        }
    }, [open, goodsType, reset, fetchTruckTypes]);

    const onSubmit = async (values: GoodsTypeFormValues) => {
        setRequestError(null);
        try {
            if (goodsType) {
                await updateGoodType(goodsType.id, values);
            } else {
                await addGoodType(values);
            }
            fetchGoodTypes();
            fetchAnalytics();
            onOpenChange(false);
        } catch (error) {
            if (import.meta.env.DEV) console.error("Failed to save goods type", error);
            setRequestError(axiosRequestErrorMessage(error));
        }
    };

    const selectedTruckIds = watch("truck_type_ids");

    const toggleTruckId = (id: number) => {
        const current = [...selectedTruckIds];
        const index = current.indexOf(id);
        if (index > -1) {
            current.splice(index, 1);
        } else {
            current.push(id);
        }
        setValue("truck_type_ids", current);
    };

    return (
        <CommonModal open={open} onOpenChange={onOpenChange} maxWidth="sm:max-w-[500px]">
            <CommonModalHeader
                title={goodsType ? t("dataManagement:goodsModal.editTitle") : t("dataManagement:goodsModal.addTitle")}
                description={
                    goodsType ? t("dataManagement:goodsModal.editDescription") : t("dataManagement:goodsModal.addDescription")
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
                                {t("dataManagement:goodsModal.activeLabel")}
                            </Label>
                            <p className="text-[10px] text-main-sharkGray">{t("dataManagement:goodsModal.activeHint")}</p>
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
                                    label={t("dataManagement:goodsModal.nameEn")}
                                    placeholder={t("dataManagement:goodsModal.nameEnPlaceholder")}
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
                                        label={t("dataManagement:goodsModal.nameAr")}
                                        placeholder={t("dataManagement:goodsModal.nameArPlaceholder")}
                                        field={field}
                                    />
                                </div>
                            )}
                        />
                    </div>

                    <Controller
                        name="value"
                        control={control}
                        render={({ field }) => (
                            <CommonInput
                                label={t("dataManagement:goodsModal.value")}
                                placeholder={t("dataManagement:goodsModal.valuePlaceholder")}
                                field={field}
                            />
                        )}
                    />

                    <Controller
                        name="description"
                        control={control}
                        render={({ field }) => (
                            <CommonInput
                                label={t("dataManagement:goodsModal.description")}
                                placeholder={t("dataManagement:goodsModal.descriptionPlaceholder")}
                                type="textarea"
                                field={field}
                            />
                        )}
                    />

                    <div className="space-y-2.5">
                        <div className="flex items-center justify-between gap-2">
                            <Label className="text-sm font-semibold text-main-mirage">
                                {t("dataManagement:goodsModal.allowedTrucks")}
                            </Label>
                            {selectedTruckIds.length > 0 ? (
                                <span className="text-xs font-medium text-main-primary bg-main-primary/10 px-2 py-0.5 rounded-full shrink-0">
                                    {t("dataManagement:goodsModal.selectedCount", { count: selectedTruckIds.length })}
                                </span>
                            ) : null}
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            {truckTypes.map((truck) => {
                                const isChecked = selectedTruckIds.includes(truck.id);
                                return (
                                    <button
                                        key={truck.id}
                                        type="button"
                                        onClick={() => toggleTruckId(truck.id)}
                                        className={clsx(
                                            "flex items-center gap-2.5 px-3 py-2.5 rounded-xl border text-start transition-all duration-150 cursor-pointer select-none",
                                            isChecked
                                                ? "bg-main-primary/[0.04] border-main-primary/30 shadow-sm"
                                                : "bg-main-titaniumWhite/60 border-main-whiteMarble hover:border-main-sharkGray/20 hover:bg-main-titaniumWhite",
                                        )}
                                    >
                                        <div
                                            className={clsx(
                                                "w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-all duration-150",
                                                isChecked ? "bg-main-primary" : "border border-main-whiteMarble",
                                            )}
                                        >
                                            {isChecked ? <Check className="w-3 h-3 text-white stroke-3" /> : null}
                                        </div>
                                        <span
                                            className={clsx(
                                                "text-sm font-medium leading-tight transition-colors",
                                                isChecked ? "text-main-primary" : "text-main-mirage/80",
                                            )}
                                        >
                                            {truck.name}
                                        </span>
                                    </button>
                                );
                            })}
                            {truckTypes.length === 0 ? (
                                <p className="text-xs text-main-remove col-span-2 py-2">{t("dataManagement:goodsModal.noTruckTypes")}</p>
                            ) : null}
                        </div>
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
                        disabled={submitting || truckTypes.length === 0}
                        className="bg-main-primary hover:bg-main-primary/90 text-white font-bold h-11 px-10 common-rounded shadow-lg shadow-main-primary/20"
                    >
                        {submitting
                            ? t("dataManagement:goodsModal.saving")
                            : goodsType
                              ? t("dataManagement:goodsModal.saveUpdate")
                              : t("dataManagement:goodsModal.saveAdd")}
                    </Button>
                </CommonModalFooter>
            </form>
        </CommonModal>
    );
};

export default GoodsTypeModal;
