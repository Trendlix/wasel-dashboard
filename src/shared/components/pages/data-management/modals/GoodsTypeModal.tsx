import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CommonModal, CommonModalHeader, CommonModalBody, CommonModalFooter } from "@/shared/components/common/CommonModal";
import { CommonInput } from "@/shared/components/common/FormItems";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import useDataManagementStore, { IGoodsType } from "@/shared/hooks/store/useDataManagementStore";

const goodsTypeSchema = z.object({
    name: z.string().min(1, "Name is required"),
    name_ar: z.string().min(1, "Arabic name is required"),
    description: z.string().min(1, "Description is required"),
    value: z.string().min(1, "Value is required"),
    truck_type_ids: z.array(z.number()).min(1, "Select at least one truck type"),
    is_active: z.boolean(),
});

type GoodsTypeFormValues = z.infer<typeof goodsTypeSchema>;

interface GoodsTypeModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    goodsType?: IGoodsType | null;
}

const GoodsTypeModal = ({ open, onOpenChange, goodsType }: GoodsTypeModalProps) => {
    const { truckTypes, fetchTruckTypes, addGoodType, updateGoodType, submitting, fetchAnalytics, fetchGoodTypes } = useDataManagementStore();

    const { control, handleSubmit, reset, setValue, watch } = useForm<GoodsTypeFormValues>({
        resolver: zodResolver(goodsTypeSchema),
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
        if (open) {
            fetchTruckTypes(1, 100); // Fetch all truck types for selection
            if (goodsType) {
                reset({
                    name: goodsType.name,
                    name_ar: goodsType.name_ar || "",
                    description: goodsType.description,
                    value: goodsType.value,
                    truck_type_ids: goodsType.truckTypeGoods.map(tg => tg.truck_type_id),
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
        }
    }, [open, goodsType, reset, fetchTruckTypes]);

    const onSubmit = async (values: GoodsTypeFormValues) => {
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
            console.error("Failed to save goods type", error);
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
                title={goodsType ? "Edit Goods Type" : "Add Goods Type"}
                description={goodsType ? "Update the details of this goods type" : "Create a new goods type for the platform"}
            />
            <form onSubmit={handleSubmit(onSubmit)}>
                <CommonModalBody className="space-y-4">
                    <div className="flex items-center justify-between bg-main-titaniumWhite/30 p-4 common-rounded border border-main-whiteMarble/50 shadow-sm">
                        <div className="space-y-0.5">
                            <Label htmlFor="is_active" className="text-sm font-bold text-main-mirage">
                                Active Status
                            </Label>
                            <p className="text-[10px] text-main-sharkGray">Toggle to enable or disable this goods type</p>
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

                    <div className="grid grid-cols-2 gap-4">
                        <Controller
                            name="name"
                            control={control}
                            render={({ field }) => (
                                <CommonInput label="Name (English)" placeholder="e.g. Electronics" field={field} />
                            )}
                        />
                        <Controller
                            name="name_ar"
                            control={control}
                            render={({ field }) => (
                                <div dir="rtl" className="text-right">
                                    <CommonInput label="Name (Arabic)" placeholder="مثال: إلكترونيات" field={field} />
                                </div>
                            )}
                        />
                    </div>

                    <Controller
                        name="value"
                        control={control}
                        render={({ field }) => (
                            <CommonInput label="Identifier / Value" placeholder="e.g. electronics" field={field} />
                        )}
                    />

                    <Controller
                        name="description"
                        control={control}
                        render={({ field }) => (
                            <CommonInput label="Description" placeholder="Provide more details about this goods type" type="textarea" field={field} />
                        )}
                    />

                    <div className="space-y-3">
                        <Label className="text-sm font-medium text-main-sharkGray block">Allowed Truck Types</Label>
                        <div className="grid grid-cols-2 gap-3 bg-main-titaniumWhite/50 p-4 common-rounded">
                            {truckTypes.map((truck) => (
                                <div key={truck.id} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={`truck-${truck.id}`}
                                        checked={selectedTruckIds.includes(truck.id)}
                                        onCheckedChange={() => toggleTruckId(truck.id)}
                                    />
                                    <label
                                        htmlFor={`truck-${truck.id}`}
                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                    >
                                        {truck.name}
                                    </label>
                                </div>
                            ))}
                            {truckTypes.length === 0 && (
                                <p className="text-xs text-main-red col-span-2">No truck types found. Please add a truck type first.</p>
                            )}
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
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        disabled={submitting || truckTypes.length === 0}
                        className="bg-main-primary hover:bg-main-primary/90 text-white font-bold h-11 px-10 common-rounded shadow-lg shadow-main-primary/20"
                    >
                        {submitting ? "Saving..." : goodsType ? "Update" : "Add"}
                    </Button>
                </CommonModalFooter>
            </form>
        </CommonModal>
    );
};

export default GoodsTypeModal;
