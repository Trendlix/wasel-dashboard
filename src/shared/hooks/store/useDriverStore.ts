import { create } from "zustand";
import axiosNormalApiClient from "@/shared/utils/axios";
import { isAxiosError } from "axios";

export type TAppDriverStatus =
    | "pending"
    | "approved"
    | "suspended"
    | "blocked"
    | "rejected"
    | "deleted";

export interface IAppDriver {
    id: number;
    name: string | null;
    email: string | null;
    phone: string;
    status: TAppDriverStatus;
    rating: number;
    created_at: string;
    updated_at: string;
}

export interface IDriverPaginationMeta {
    total: number;
    page: number;
    limit: number;
    total_pages: number;
    current_page: number;
    next_page: number | null;
    previous_page: number | null;
    has_next_page: boolean;
    has_previous_page: boolean;
    is_first_page: boolean;
    is_last_page: boolean;
}

export interface IDriverQuery {
    page?: number;
    limit?: number;
    search?: string;
    order?: "asc" | "desc";
    status?: TAppDriverStatus;
}

export interface IDriversAnalytics {
    total_drivers: number;
    approved_drivers: number;
    pending_drivers: number;
}

interface DriverState {
    drivers: IAppDriver[];
    meta: IDriverPaginationMeta | null;
    analytics: IDriversAnalytics | null;
    analyticsLoading: boolean;
    loading: boolean;
    updating: boolean;
    exporting: boolean;
    error: string | null;
    query: IDriverQuery;

    fetchDrivers: (query?: IDriverQuery) => Promise<void>;
    fetchDriversAnalytics: () => Promise<void>;
    setPage: (page: number) => void;
    setQuery: (query: Partial<IDriverQuery>) => void;
    resetQuery: () => void;
    updateStatus: (id: number, status: TAppDriverStatus) => Promise<void>;
    exportDrivers: (payload?: { date_from?: string; date_to?: string }) => Promise<void>;
}

const extractErrorMessage = (error: unknown, fallback: string): string => {
    if (!isAxiosError(error)) return fallback;
    return error.response?.data?.message || fallback;
};

const defaultQuery: IDriverQuery = {
    page: 1,
    limit: 10,
    order: "desc",
};

const useDriverStore = create<DriverState>((set, get) => ({
    drivers: [],
    meta: null,
    analytics: null,
    analyticsLoading: false,
    loading: false,
    updating: false,
    exporting: false,
    error: null,
    query: defaultQuery,

    fetchDrivers: async (query) => {
        const params = query ?? get().query;
        set({ loading: true, error: null });
        try {
            const response = await axiosNormalApiClient.get("/dashboard/drivers", { params });
            set({
                drivers: response.data.data,
                meta: response.data.meta,
                loading: false,
            });
        } catch (error) {
            set({
                error: extractErrorMessage(error, "Failed to fetch drivers"),
                loading: false,
            });
        }
    },

    fetchDriversAnalytics: async () => {
        set({ analyticsLoading: true, error: null });
        try {
            const response = await axiosNormalApiClient.get("/dashboard/drivers/analytics");
            set({
                analytics: response.data.data,
                analyticsLoading: false,
            });
        } catch (error) {
            set({
                error: extractErrorMessage(error, "Failed to fetch drivers analytics"),
                analyticsLoading: false,
            });
        }
    },

    setPage: (page) => {
        const next = { ...get().query, page };
        set({ query: next });
        get().fetchDrivers(next);
    },

    setQuery: (partial) => {
        const next = { ...get().query, ...partial, page: 1 };
        set({ query: next });
        get().fetchDrivers(next);
    },

    resetQuery: () => {
        set({ query: defaultQuery });
        get().fetchDrivers(defaultQuery);
    },

    updateStatus: async (id, status) => {
        set({ updating: true, error: null });
        try {
            await axiosNormalApiClient.patch(`/dashboard/drivers/${id}/status`, { status });
            set((state) => ({
                drivers: state.drivers.map((d) => d.id === id ? { ...d, status } : d),
                updating: false,
            }));
        } catch (error) {
            set({
                error: extractErrorMessage(error, "Failed to update driver status"),
                updating: false,
            });
            throw error;
        }
    },

    exportDrivers: async (payload) => {
        set({ exporting: true, error: null });
        try {
            await axiosNormalApiClient.post("/dashboard/drivers/export", {
                ...get().query,
                ...payload,
            });
        } catch (error) {
            set({
                error: extractErrorMessage(error, "Failed to export drivers"),
            });
            throw error;
        } finally {
            set({ exporting: false });
        }
    },
}));

export default useDriverStore;
