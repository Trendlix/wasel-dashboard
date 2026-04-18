import { useEffect } from "react";
import { useForm, Controller, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CommonModal, CommonModalHeader, CommonModalBody, CommonModalFooter } from "@/shared/components/common/CommonModal";
import { CommonInput } from "@/shared/components/common/FormItems";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import useDataManagementStore, { ITruckType } from "@/shared/hooks/store/useDataManagementStore";

const truckTypeSchema = z.object({
    name: z.string().min(1, "Name is required"),
    name_ar: z.string().min(1, "Arabic name is required"),
    description: z.string().min(1, "Description is required"),
    capacity: z.coerce.number().min(1, "Capacity is required"),
    capacity_unit: z.string().min(1, "Unit is required"),
    price_per_km: z.coerce.number().min(1, "Price is required"),
    length_in_cm: z.coerce.number().optional(),
    width_in_cm: z.coerce.number().optional(),
    height_in_cm: z.coerce.number().optional(),
    is_active: z.boolean(),
});

type TruckTypeFormValues = z.infer<typeof truckTypeSchema>;

interface TruckTypeModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    truckType?: ITruckType | null;
}

const TruckTypeModal = ({ open, onOpenChange, truckType }: TruckTypeModalProps) => {
    const { addTruckType, updateTruckType, submitting, fetchAnalytics, fetchTruckTypes } = useDataManagementStore();

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
        if (open) {
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
        }
    }, [open, truckType, reset]);

    const onSubmit = async (values: TruckTypeFormValues) => {
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
            console.error("Failed to save truck type", error);
        }
    };

    return (
        <CommonModal open={open} onOpenChange={onOpenChange} maxWidth="sm:max-w-[500px]">
            <CommonModalHeader
                title={truckType ? "Edit Truck Type" : "Add Truck Type"}
                description={truckType ? "Update the details of this truck type" : "Create a new truck type for the platform"}
            />
            <form onSubmit={handleSubmit(onSubmit)}>
                <CommonModalBody className="space-y-4">
                    <div className="flex items-center justify-between bg-main-titaniumWhite/30 p-4 common-rounded border border-main-whiteMarble/50 shadow-sm">
                        <div className="space-y-0.5">
                            <Label htmlFor="is_active" className="text-sm font-bold text-main-mirage">
                                Active Status
                            </Label>
                            <p className="text-[10px] text-main-sharkGray">Toggle to enable or disable this truck type</p>
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
                                <CommonInput label="Name (English)" placeholder="e.g. Pickup" field={field} />
                            )}
                        />
                        <Controller
                            name="name_ar"
                            control={control}
                            render={({ field }) => (
                                <div dir="rtl" className="text-right">
                                    <CommonInput label="Name (Arabic)" placeholder="مثال: بيك آب" field={field} />
                                </div>
                            )}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Controller
                            name="capacity"
                            control={control}
                            render={({ field }) => (
                                <CommonInput label="Capacity" placeholder="e.g. 5000" field={field} />
                            )}
                        />
                        <Controller
                            name="capacity_unit"
                            control={control}
                            render={({ field }) => (
                                <CommonInput label="Unit" placeholder="e.g. kg" field={field} />
                            )}
                        />
                    </div>

                    <Controller
                        name="price_per_km"
                        control={control}
                        render={({ field }) => (
                            <CommonInput label="Price per KM" placeholder="e.g. 150" field={field} />
                        )}
                    />

                    <Controller
                        name="description"
                        control={control}
                        render={({ field }) => (
                            <CommonInput label="Description" placeholder="Details about this truck type" type="textarea" field={field} />
                        )}
                    />

                    <div className="grid grid-cols-3 gap-3">
                        <Controller
                            name="length_in_cm"
                            control={control}
                            render={({ field }) => (
                                <CommonInput label="Length (cm)" placeholder="600" field={field} />
                            )}
                        />
                        <Controller
                            name="width_in_cm"
                            control={control}
                            render={({ field }) => (
                                <CommonInput label="Width (cm)" placeholder="250" field={field} />
                            )}
                        />
                        <Controller
                            name="height_in_cm"
                            control={control}
                            render={({ field }) => (
                                <CommonInput label="Height (cm)" placeholder="300" field={field} />
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
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        disabled={submitting}
                        className="bg-main-primary hover:bg-main-primary/90 text-white font-bold h-11 px-10 common-rounded"
                    >
                        {submitting ? "Saving..." : truckType ? "Update" : "Add"}
                    </Button>
                </CommonModalFooter>
            </form>
        </CommonModal >
    );
};

export default TruckTypeModal;
