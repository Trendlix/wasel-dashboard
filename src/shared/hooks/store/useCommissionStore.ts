import { create } from "zustand";
import axiosNormalApiClient from "@/shared/utils/axios";
import { isAxiosError } from "axios";

export type TCommissionCategory = "trip" | "storage" | "advertising";
export type TCommissionType = "fixed" | "percentage";

export interface ICommission {
    id: number;
    category: TCommissionCategory;
    description: string | null;
    type: TCommissionType;
    rate: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface ICommissionPayload {
    category: TCommissionCategory;
    type: TCommissionType;
    rate: number;
    description?: string;
    is_active: boolean;
}

export interface ICommissionAnalytics {
    category: TCommissionCategory;
    type: TCommissionType;
    rate: string;
    count: number;
}

interface CommissionState {
    commissions: ICommission[];
    analytics: ICommissionAnalytics[];
    loading: boolean;
    analyticsLoading: boolean;
    submitting: boolean;
    error: string | null;

    fetchCommissions: () => Promise<void>;
    createCommission: (data: ICommissionPayload) => Promise<void>;
    updateCommission: (id: number, data: ICommissionPayload) => Promise<void>;
    deleteCommission: (id: number) => Promise<void>;
    fetchAnalytics: () => Promise<void>;
}

const extractErrorMessage = (error: unknown, fallback: string): string => {
    if (!isAxiosError(error)) return fallback;
    return error.response?.data?.message || fallback;
};

const useCommissionStore = create<CommissionState>((set) => ({
    commissions: [],
    analytics: [],
    loading: false,
    analyticsLoading: false,
    submitting: false,
    error: null,

    fetchCommissions: async () => {
        set({ loading: true, error: null });
        try {
            const response = await axiosNormalApiClient.get("/dashboard/commissions");
            set({ commissions: response.data.data, loading: false });
        } catch (error) {
            set({ error: extractErrorMessage(error, "Failed to fetch commissions"), loading: false });
        }
    },

    createCommission: async (data) => {
        set({ submitting: true, error: null });
        try {
            await axiosNormalApiClient.post("/dashboard/commissions", data);
            set({ submitting: false });
        } catch (error) {
            set({ error: extractErrorMessage(error, "Failed to create commission"), submitting: false });
            throw error;
        }
    },

    updateCommission: async (id, data) => {
        set({ submitting: true, error: null });
        try {
            await axiosNormalApiClient.patch(`/dashboard/commissions/${id}`, data);
            set({ submitting: false });
        } catch (error) {
            set({ error: extractErrorMessage(error, "Failed to update commission"), submitting: false });
            throw error;
        }
    },

    deleteCommission: async (id) => {
        set({ submitting: true, error: null });
        try {
            await axiosNormalApiClient.delete(`/dashboard/commissions/${id}`);
            set({ submitting: false });
        } catch (error) {
            set({ error: extractErrorMessage(error, "Failed to delete commission"), submitting: false });
            throw error;
        }
    },

    fetchAnalytics: async () => {
        set({ analyticsLoading: true });
        try {
            const response = await axiosNormalApiClient.get("/dashboard/commissions/analytics");
            set({ analytics: response.data.data, analyticsLoading: false });
        } catch (error) {
            set({ analyticsLoading: false });
            console.error("Failed to fetch commission analytics", error);
        }
    },
}));

export default useCommissionStore;
