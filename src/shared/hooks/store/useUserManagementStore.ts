import { create } from "zustand";
import axiosNormalApiClient from "@/shared/utils/axios";
import { isAxiosError } from "axios";

export interface AdminUser {
    id: number;
    name: string;
    email: string;
    status: "active" | "blocked" | "twofa";
    role: {
        id: number;
        name: string;
        slug: string;
    };
    twofa_enabled: boolean;
    last_login: string | null;
}

export interface UserManagementStats {
    total_roles: number;
    active_admins: number;
    total_admins: number;
    enabled_2fa: number;
}

export interface UserManagementMeta {
    pagination: {
        total: number;
        page: number;
        limit: number;
        total_pages: number;
    };
}

interface RequestMeta {
    showToast?: boolean;
    toastType?: "success" | "error" | "info" | "alert";
}

export interface InviteAdminPayload {
    email: string;
    role_id: number;
}

interface UserManagementState {
    users: AdminUser[];
    meta: UserManagementMeta | null;
    stats: UserManagementStats | null;
    loading: boolean;
    loadingStats: boolean;
    error: string | null;

    fetchUsers: (query?: { page?: number; limit?: number }) => Promise<void>;
    fetchStats: () => Promise<void>;
    inviteUser: (data: InviteAdminPayload, meta?: RequestMeta) => Promise<void>;
    updateUser: (id: number, data: { role_id?: number; status?: string }, meta?: RequestMeta) => Promise<void>;
    removeUser: (id: number, meta?: RequestMeta) => Promise<void>;
    approveUser: (id: number, meta?: RequestMeta) => Promise<void>;
}

const extractErrorMessage = (error: unknown, fallback: string) => {
    if (!isAxiosError(error)) return fallback;
    return error.response?.data?.message || fallback;
};

const useUserManagementStore = create<UserManagementState>((set, get) => ({
    users: [],
    meta: null,
    stats: null,
    loading: false,
    loadingStats: false,
    error: null,

    fetchUsers: async (query = {}) => {
        set({ loading: true, error: null });
        try {
            const response = await axiosNormalApiClient.get("/admin/list", { params: query });
            set({
                users: response.data.data,
                meta: response.data.meta,
                loading: false,
            });
        } catch (error) {
            set({ error: extractErrorMessage(error, "Failed to fetch users"), loading: false });
        }
    },

    fetchStats: async () => {
        set({ loadingStats: true, error: null });
        try {
            const response = await axiosNormalApiClient.get("/admin/stats");
            set({ stats: response.data.data, loadingStats: false });
        } catch (error) {
            set({ error: extractErrorMessage(error, "Failed to fetch stats"), loadingStats: false });
        }
    },

    inviteUser: async (data, meta) => {
        set({ loading: true, error: null });
        try {
            await axiosNormalApiClient.post("/admin/invite", data, { meta });
            await get().fetchUsers();
            await get().fetchStats();
        } catch (error) {
            const msg = extractErrorMessage(error, "Failed to invite user");
            set({ error: msg, loading: false });
            throw new Error(msg);
        }
    },

    updateUser: async (id, data, meta) => {
        set({ loading: true, error: null });
        try {
            await axiosNormalApiClient.patch(`/admin/${id}/role`, data, { meta });
            await get().fetchUsers();
            await get().fetchStats();
        } catch (error) {
            const msg = extractErrorMessage(error, "Failed to update user");
            set({ error: msg, loading: false });
            throw new Error(msg);
        }
    },

    removeUser: async (id, meta) => {
        set({ loading: true, error: null });
        try {
            await axiosNormalApiClient.delete(`/admin/${id}`, { meta });
            await get().fetchUsers();
            await get().fetchStats();
        } catch (error) {
            const msg = extractErrorMessage(error, "Failed to remove user");
            set({ error: msg, loading: false });
            throw new Error(msg);
        }
    },

    approveUser: async (id, meta) => {
        set({ loading: true, error: null });
        try {
            await axiosNormalApiClient.patch(`/admin/${id}/approve`, {}, { meta });
            await get().fetchUsers();
            await get().fetchStats();
        } catch (error) {
            const msg = extractErrorMessage(error, "Failed to approve user");
            set({ error: msg, loading: false });
            throw new Error(msg);
        }
    },
}));

export default useUserManagementStore;