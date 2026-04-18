import { create } from "zustand";
import axiosNormalApiClient from "@/shared/utils/axios";
import { isAxiosError } from "axios";
import { extractEnabledPageKeys } from "@/shared/utils/rolePages";

export interface AdminRole {
    id: number;
    name: string;
    slug: string;
    description?: string;
    pages: string[];
    role: string;
    created_at: string;
    updated_at: string;
}

interface RequestMeta {
    showToast?: boolean;
    toastType?: "success" | "error" | "info" | "alert";
}

interface RolesState {
    roles: AdminRole[];
    loading: boolean;
    error: string | null;

    fetchRoles: () => Promise<void>;
    addRole: (data: Partial<AdminRole>, meta?: RequestMeta) => Promise<void>;
    updateRole: (id: number, data: Partial<AdminRole>, meta?: RequestMeta) => Promise<void>;
    deleteRole: (id: number, meta?: RequestMeta) => Promise<void>;
    getRoleById: (id: number) => Promise<AdminRole | null>;
}

const normalizeRole = (role: any): AdminRole => ({
    ...role,
    pages: extractEnabledPageKeys(role?.pages),
});

const extractErrorMessage = (error: unknown, fallback: string) => {
    if (!isAxiosError(error)) return fallback;
    return error.response?.data?.message || fallback;
};

const useRolesStore = create<RolesState>((set, get) => ({
    roles: [],
    loading: false,
    error: null,

    fetchRoles: async () => {
        set({ loading: true, error: null });
        try {
            const response = await axiosNormalApiClient.get("/admin/role");
            const normalizedRoles = Array.isArray(response.data.data)
                ? response.data.data.map(normalizeRole)
                : [];
            set({ roles: normalizedRoles, loading: false });
        } catch (error) {
            set({ error: extractErrorMessage(error, "Failed to fetch roles"), loading: false });
        }
    },

    addRole: async (data, meta) => {
        set({ loading: true, error: null });
        try {
            await axiosNormalApiClient.post(
                "/admin/role",
                {
                    ...data,
                    pages: extractEnabledPageKeys(data?.pages),
                },
                { meta }
            );
            await get().fetchRoles();
        } catch (error) {
            const msg = extractErrorMessage(error, "Failed to create role");
            set({ error: msg, loading: false });
            throw new Error(msg);
        }
    },

    updateRole: async (id, data, meta) => {
        set({ loading: true, error: null });
        try {
            await axiosNormalApiClient.patch(
                `/admin/role/${id}`,
                {
                    ...data,
                    pages: data.pages === undefined ? undefined : extractEnabledPageKeys(data.pages),
                },
                { meta }
            );
            await get().fetchRoles();
        } catch (error) {
            const msg = extractErrorMessage(error, "Failed to update role");
            set({ error: msg, loading: false });
            throw new Error(msg);
        }
    },

    deleteRole: async (id, meta) => {
        set({ loading: true, error: null });
        try {
            await axiosNormalApiClient.delete(`/admin/role/${id}`, { meta });
            await get().fetchRoles();
        } catch (error) {
            const msg = extractErrorMessage(error, "Failed to delete role");
            set({ error: msg, loading: false });
            throw new Error(msg);
        }
    },

    getRoleById: async (id) => {
        const { roles } = get();
        const existing = roles.find((r) => r.id === id);
        if (existing) return existing;

        try {
            const response = await axiosNormalApiClient.get(`/admin/role/${id}`);
            return normalizeRole(response.data.data);
        } catch {
            return null;
        }
    },
}));

export default useRolesStore;
