import { create } from "zustand";
import axiosNormalApiClient from "@/shared/utils/axios";
import { isAxiosError } from "axios";

export type TItemStatus = "active" | "inactive";

export interface ITruckType {
    id: number;
    name: string;
    name_ar: string | null;
    price_per_km: string;
    length_in_cm: number | null;
    width_in_cm: number | null;
    height_in_cm: number | null;
    capacity: number | null;
    capacity_unit: string | null;
    description: string | null;
    is_active: boolean;
    created_at: string;
}

export interface IGoodsType {
    id: number;
    name: string;
    name_ar: string | null;
    is_active: boolean;
    value: string;
    description: string;
    truckTypeGoods: {
        truck_type_id: number;
        type_of_truck: ITruckType;
    }[];
    created_at: string;
}

export interface IPaginationMeta {
    total: number;
    page: number;
    limit: number;
}

export interface IDataManagementAnalytics {
    truckTypes: { total: number; active: number };
    goodsTypes: { total: number; active: number };
}

interface DataManagementState {
    truckTypes: ITruckType[];
    goodsTypes: IGoodsType[];
    meta: IPaginationMeta | null;
    analytics: IDataManagementAnalytics | null;
    loading: boolean;
    analyticsLoading: boolean;
    submitting: boolean;
    error: string | null;

    fetchTruckTypes: (page?: number, limit?: number) => Promise<void>;
    addTruckType: (data: any) => Promise<void>;
    updateTruckType: (id: number, data: any) => Promise<void>;
    deleteTruckType: (id: number) => Promise<void>;

    fetchGoodTypes: (page?: number, limit?: number) => Promise<void>;
    addGoodType: (data: any) => Promise<void>;
    updateGoodType: (id: number, data: any) => Promise<void>;
    deleteGoodType: (id: number) => Promise<void>;

    fetchAnalytics: () => Promise<void>;
}

const extractErrorMessage = (error: unknown, fallback: string): string => {
    if (!isAxiosError(error)) return fallback;
    return error.response?.data?.message || fallback;
};

const useDataManagementStore = create<DataManagementState>((set) => ({
    truckTypes: [],
    goodsTypes: [],
    meta: null,
    analytics: null,
    loading: false,
    analyticsLoading: false,
    submitting: false,
    error: null,

    fetchTruckTypes: async (page = 1, limit = 10) => {
        set({ loading: true, error: null });
        try {
            const response = await axiosNormalApiClient.get("/dashboard/data-management/truck-types", {
                params: { page, limit }
            });
            set({
                truckTypes: response.data.data,
                meta: response.data.meta,
                loading: false,
            });
        } catch (error) {
            set({ error: extractErrorMessage(error, "Failed to fetch truck types"), loading: false });
        }
    },

    addTruckType: async (data) => {
        set({ submitting: true, error: null });
        try {
            await axiosNormalApiClient.post("/dashboard/data-management/truck-types", data);
            set({ submitting: false });
        } catch (error) {
            set({ error: extractErrorMessage(error, "Failed to add truck type"), submitting: false });
            throw error;
        }
    },

    updateTruckType: async (id, data) => {
        set({ submitting: true, error: null });
        try {
            await axiosNormalApiClient.patch(`/dashboard/data-management/truck-types/${id}`, data);
            set({ submitting: false });
        } catch (error) {
            set({ error: extractErrorMessage(error, "Failed to update truck type"), submitting: false });
            throw error;
        }
    },

    deleteTruckType: async (id) => {
        set({ submitting: true, error: null });
        try {
            await axiosNormalApiClient.delete(`/dashboard/data-management/truck-types/${id}`);
            set({ submitting: false });
        } catch (error) {
            set({ error: extractErrorMessage(error, "Failed to delete truck type"), submitting: false });
            throw error;
        }
    },

    fetchGoodTypes: async (page = 1, limit = 10) => {
        set({ loading: true, error: null });
        try {
            const response = await axiosNormalApiClient.get("/dashboard/data-management/good-types", {
                params: { page, limit }
            });
            set({
                goodsTypes: response.data.data,
                meta: response.data.meta,
                loading: false,
            });
        } catch (error) {
            set({ error: extractErrorMessage(error, "Failed to fetch good types"), loading: false });
        }
    },

    addGoodType: async (data) => {
        set({ submitting: true, error: null });
        try {
            await axiosNormalApiClient.post("/dashboard/data-management/good-types", data);
            set({ submitting: false });
        } catch (error) {
            set({ error: extractErrorMessage(error, "Failed to add good type"), submitting: false });
            throw error;
        }
    },

    updateGoodType: async (id, data) => {
        set({ submitting: true, error: null });
        try {
            await axiosNormalApiClient.patch(`/dashboard/data-management/good-types/${id}`, data);
            set({ submitting: false });
        } catch (error) {
            set({ error: extractErrorMessage(error, "Failed to update good type"), submitting: false });
            throw error;
        }
    },

    deleteGoodType: async (id) => {
        set({ submitting: true, error: null });
        try {
            await axiosNormalApiClient.delete(`/dashboard/data-management/good-types/${id}`);
            set({ submitting: false });
        } catch (error) {
            set({ error: extractErrorMessage(error, "Failed to delete good type"), submitting: false });
            throw error;
        }
    },

    fetchAnalytics: async () => {
        set({ analyticsLoading: true });
        try {
            const response = await axiosNormalApiClient.get("/dashboard/data-management/analytics");
            set({ analytics: response.data.data, analyticsLoading: false });
        } catch (error) {
            set({ analyticsLoading: false });
            console.error("Failed to fetch data management analytics", error);
        }
    },
}));

export default useDataManagementStore;
