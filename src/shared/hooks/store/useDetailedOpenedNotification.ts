import { create } from "zustand";
import { isAxiosError } from "axios";
import axiosNormalApiClient from "@/shared/utils/axios";

export type TDetailedNotificationType = "user" | "driver" | "trip";

interface IRelatedUser {
    id: number;
    full_name: string;
    email: string;
    phone: string;
    is_deleted: boolean;
    created_at: string;
}

interface IRelatedDriver {
    id: number;
    name: string | null;
    email: string | null;
    phone: string;
    is_deleted: boolean;
    deleted_at: string | null;
    created_at: string;
}

interface IRelatedTrip {
    id: number;
    booking_number: string;
    status: string;
    created_at: string;
    completed_at: string | null;
    cancelled_at: string | null;
    cancelled_by: "user" | "driver" | null;
    picked_up_at: string | null;
    driver: IRelatedDriver;
    request: { user: IRelatedUser };
}

interface IDetailedNotificationBase {
    id: number;
    title: string;
    description: string;
    created_at: string;
    payload: Record<string, unknown> | null;
}

export interface IDetailedUserNotification extends IDetailedNotificationBase {
    user: IRelatedUser;
}

export interface IDetailedDriverNotification extends IDetailedNotificationBase {
    driver: IRelatedDriver;
}

export interface IDetailedTripNotification extends IDetailedNotificationBase {
    trip: IRelatedTrip;
}

export type TDetailedNotification =
    | IDetailedUserNotification
    | IDetailedDriverNotification
    | IDetailedTripNotification;

interface DetailedOpenedNotificationState {
    data: TDetailedNotification | null;
    type: TDetailedNotificationType | null;
    loading: boolean;
    error: string | null;

    fetch: (type: TDetailedNotificationType, id: number) => Promise<void>;
    reset: () => void;
}

const extractErrorMessage = (error: unknown, fallback: string): string => {
    if (!isAxiosError(error)) return fallback;
    return error.response?.data?.message || fallback;
};

const useDetailedOpenedNotification = create<DetailedOpenedNotificationState>((set) => ({
    data: null,
    type: null,
    loading: false,
    error: null,

    fetch: async (type, id) => {
        set({ loading: true, error: null, data: null, type });
        try {
            const response = await axiosNormalApiClient.get(`/dashboard/notifications/${type}/${id}`);
            set({ data: response.data.data, loading: false });
        } catch (error) {
            set({
                error: extractErrorMessage(error, "Failed to fetch notification details"),
                loading: false,
            });
        }
    },

    reset: () => set({ data: null, type: null, loading: false, error: null }),
}));

export default useDetailedOpenedNotification;
