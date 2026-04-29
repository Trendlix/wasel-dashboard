import { z } from "zod";

const dropOffSchema = z.object({
    lat: z.number(),
    long: z.number(),
    destination_name: z.string().trim().min(1, "Destination name is required"),
});

export const testCenterTripSchema = z.object({
    user_id: z.number().int().positive("User ID is required"),
    user_lat: z.number(),
    user_long: z.number(),
    pickup_lat: z.number(),
    pickup_long: z.number(),
    pickup_name: z.string().trim().min(1, "Pickup name is required"),
    trip_at: z.string().trim().min(1, "Trip date is required"),
    type_of_goods_id: z.number().int().positive("Goods type is required"),
    type_of_truck_id: z.number().int().positive("Truck type is required"),
    total_weight: z.number().positive("Weight must be greater than 0"),
    currency: z.string().trim().min(1, "Currency is required"),
    offered_price_by_user: z.number().positive("Offered price must be greater than 0"),
    special_notes: z.string().trim().optional(),
    drop_off_locations: z.array(dropOffSchema).min(1, "At least one drop-off location is required"),
});

export type TestCenterTripFormValues = z.infer<typeof testCenterTripSchema>;