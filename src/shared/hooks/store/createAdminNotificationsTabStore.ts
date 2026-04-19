import { create } from "zustand";
import { isAxiosError } from "axios";
import axiosNormalApiClient from "@/shared/utils/axios";
import useDashboardNotificationsStore from "./useDashboardNotificationsStore";

export type TAdminNotificationTabType = "user" | "driver" | "trip";
export type TReadFilter = "all" | "read" | "unread";
export type TSortValue = "created-desc" | "created-asc" | "title-asc" | "title-desc";

export interface IAdminNotificationTabRow {
    id: number;
    title: string;
    description: string;
    target_id: number | null;
    admin_id: number | null;
    created_at: string;
    is_read: boolean;
    read_at: string | null;
    payload: Record<string, unknown> | null;
}

interface IMeta {
    total: number;
    page: number;
    limit: number;
    total_pages: number;
}

export interface AdminNotificationsTabState {
    rows: IAdminNotificationTabRow[];
    meta: IMeta;
    loading: boolean;
    error: string | null;

    search: string;
    readFilter: TReadFilter;
    sortValue: TSortValue;
    page: number;
    limit: number;

    viewItem: IAdminNotificationTabRow | null;
    sendModalOpen: boolean;
    itemActionLoading: number | null;
    markAllLoading: boolean;

    setSearch: (search: string) => void;
    setReadFilter: (filter: TReadFilter) => void;
    setSortValue: (sort: TSortValue) => void;
    setPage: (page: number) => void;
    setViewItem: (item: IAdminNotificationTabRow | null) => void;
    setSendModalOpen: (open: boolean) => void;
    resetFilters: () => void;

    fetchNotifications: () => Promise<void>;
    markAsRead: (id: number) => Promise<void>;
    handleMarkAllAsRead: () => Promise<void>;
}

const extractErrorMessage = (error: unknown, fallback: string): string => {
    if (!isAxiosError(error)) return fallback;
    return error.response?.data?.message || fallback;
};

export const createAdminNotificationsTabStore = (type: TAdminNotificationTabType) => {
    return create<AdminNotificationsTabState>((set, get) => ({
        rows: [],
        meta: { total: 0, page: 1, limit: 15, total_pages: 1 },
        loading: false,
        error: null,

        search: "",
        readFilter: "all",
        sortValue: "created-desc",
        page: 1,
        limit: 15,

        viewItem: null,
        sendModalOpen: false,
        itemActionLoading: null,
        markAllLoading: false,

        setSearch: (search) => set({ search, page: 1 }),
        setReadFilter: (readFilter) => set({ readFilter, page: 1 }),
        setSortValue: (sortValue) => set({ sortValue, page: 1 }),
        setPage: (page) => set({ page }),
        setViewItem: (viewItem) => set({ viewItem }),
        setSendModalOpen: (sendModalOpen) => set({ sendModalOpen }),
        resetFilters: () => set({ search: "", readFilter: "all", sortValue: "created-desc", page: 1 }),

        fetchNotifications: async () => {
            const { page, limit, search, readFilter, sortValue } = get();
            set({ loading: true, error: null });
            try {
                const params: Record<string, unknown> = { page, limit };
                if (search.trim()) params.search = search.trim();
                if (readFilter === "read") params.is_read = true;
                if (readFilter === "unread") params.is_read = false;

                const response = await axiosNormalApiClient.get(
                    `/dashboard/notifications/by-type/${type}`,
                    { params },
                );

                let rows: IAdminNotificationTabRow[] = response.data?.data?.items ?? [];

                rows = [...rows].sort((a, b) => {
                    if (sortValue === "created-desc") return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
                    if (sortValue === "created-asc") return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
                    if (sortValue === "title-asc") return a.title.localeCompare(b.title);
                    if (sortValue === "title-desc") return b.title.localeCompare(a.title);
                    return 0;
                });

                set({
                    rows,
                    meta: response.data?.data?.meta ?? { total: 0, page, limit, total_pages: 1 },
                });
            } catch (error) {
                set({ error: extractErrorMessage(error, `Failed to fetch ${type} notifications`) });
            } finally {
                set({ loading: false });
            }
        },

        markAsRead: async (id) => {
            const { itemActionLoading, fetchNotifications } = get();
            if (itemActionLoading !== null) return;
            set({ itemActionLoading: id });
            try {
                await useDashboardNotificationsStore.getState().markNotificationItemAsRead(type, id);
                await fetchNotifications();
            } finally {
                set({ itemActionLoading: null });
            }
        },

        handleMarkAllAsRead: async () => {
            const { markAllLoading, fetchNotifications } = get();
            if (markAllLoading) return;
            set({ markAllLoading: true });
            try {
                await useDashboardNotificationsStore.getState().markTabNotificationsAsRead(type);
                await fetchNotifications();
            } finally {
                set({ markAllLoading: false });
            }
        },
    }));
};
