import { create } from "zustand";
import axiosNormalApiClient from "@/shared/utils/axios";
import { isAxiosError } from "axios";

// ─── Types ────────────────────────────────────────────────────────────────────

export type TAppUserStatus = "active" | "inactive" | "blocked" | "deleted";

export interface IAppUser {
    id: number;
    full_name: string;
    avatar: string | null;
    email: string;
    phone: string;
    email_verified: boolean;
    phone_verified: boolean;
    status: TAppUserStatus;
    total_voucher_usage: number;
    is_deleted: boolean;
    created_at: string;
    updated_at: string;
}

export interface IUserPaginationMeta {
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

export interface IUserQuery {
    page?: number;
    limit?: number;
    search?: string;
    order?: "asc" | "desc";
    status?: TAppUserStatus;
    is_deleted?: boolean;
}

export interface IUsersAnalytics {
    total_users: number;
    active_users: number;
    blocked_users: number;
}

// ─── State ────────────────────────────────────────────────────────────────────

interface UserState {
    users: IAppUser[];
    meta: IUserPaginationMeta | null;
    analytics: IUsersAnalytics | null;
    analyticsLoading: boolean;
    loading: boolean;
    updating: boolean;
    exporting: boolean;
    error: string | null;
    query: IUserQuery;

    fetchUsers: (query?: IUserQuery) => Promise<void>;
    fetchUsersAnalytics: () => Promise<void>;
    setPage: (page: number) => void;
    setQuery: (query: Partial<IUserQuery>) => void;
    resetQuery: () => void;
    updateStatus: (id: number, status: TAppUserStatus) => Promise<void>;
    exportUsers: (payload?: { date_from?: string; date_to?: string }) => Promise<void>;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const extractErrorMessage = (error: unknown, fallback: string): string => {
    if (!isAxiosError(error)) return fallback;
    return error.response?.data?.message || fallback;
};

const defaultQuery: IUserQuery = {
    page: 1,
    limit: 10,
    order: "desc",
};

// ─── Store ────────────────────────────────────────────────────────────────────

const useUserStore = create<UserState>((set, get) => ({
    users: [],
    meta: null,
    analytics: null,
    analyticsLoading: false,
    loading: false,
    updating: false,
    exporting: false,
    error: null,
    query: defaultQuery,

    fetchUsers: async (query) => {
        const params = query ?? get().query;
        set({ loading: true, error: null });
        try {
            const response = await axiosNormalApiClient.get("/dashboard/users", { params });
            set({
                users: response.data.data,
                meta: response.data.meta,
                loading: false,
            });
        } catch (error) {
            set({
                error: extractErrorMessage(error, "Failed to fetch users"),
                loading: false,
            });
        }
    },

    fetchUsersAnalytics: async () => {
        set({ analyticsLoading: true, error: null });
        try {
            const response = await axiosNormalApiClient.get("/dashboard/users/analytics");
            set({
                analytics: response.data.data,
                analyticsLoading: false,
            });
        } catch (error) {
            set({
                error: extractErrorMessage(error, "Failed to fetch users analytics"),
                analyticsLoading: false,
            });
        }
    },

    setPage: (page) => {
        const next = { ...get().query, page };
        set({ query: next });
        get().fetchUsers(next);
    },

    setQuery: (partial) => {
        const next = { ...get().query, ...partial, page: 1 };
        set({ query: next });
        get().fetchUsers(next);
    },

    resetQuery: () => {
        set({ query: defaultQuery });
        get().fetchUsers(defaultQuery);
    },

    updateStatus: async (id, status) => {
        set({ updating: true, error: null });
        try {
            await axiosNormalApiClient.patch(`/dashboard/users/${id}/status`, { status });
            // Optimistically update the local list
            set((state) => ({
                users: state.users.map((u) => u.id === id ? { ...u, status } : u),
                updating: false,
            }));
        } catch (error) {
            set({
                error: extractErrorMessage(error, "Failed to update user status"),
                updating: false,
            });
            throw error;
        }
    },

    exportUsers: async (payload) => {
        set({ exporting: true, error: null });
        try {
            const body = {
                ...get().query,
                ...(payload?.date_from ? { date_from: payload.date_from } : {}),
                ...(payload?.date_to ? { date_to: payload.date_to } : {}),
            };
            await axiosNormalApiClient.post("/dashboard/users/export", body);
        } catch (error) {
            set({
                error: extractErrorMessage(error, "Failed to export users"),
            });
            throw error;
        } finally {
            set({ exporting: false });
        }
    },
}));

export default useUserStore;
