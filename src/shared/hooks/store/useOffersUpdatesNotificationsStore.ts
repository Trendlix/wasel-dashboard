import { create } from "zustand";
import { isAxiosError } from "axios";
import axiosNormalApiClient from "@/shared/utils/axios";

export type TOffersUpdatesSource = "offer" | "update";
export type TReadFilter = "all" | "read" | "unread";
export type TSortValue = "created-desc" | "created-asc" | "title-asc" | "title-desc";

export interface IOffersUpdatesRow {
    id: number;
    row_key: string;
    source: TOffersUpdatesSource;
    title: string;
    description: string;
    target_audience: string;
    sent_by: string;
    created_at: string;
    is_read: boolean;
    payload: Record<string, unknown> | null;
}

interface IMeta {
    total: number;
    page: number;
    limit: number;
    total_pages: number;
}

interface OffersUpdatesNotificationsState {
    rows: IOffersUpdatesRow[];
    meta: IMeta;
    loading: boolean;
    error: string | null;

    search: string;
    readFilter: TReadFilter;
    sortValue: TSortValue;
    page: number;
    limit: number;

    viewItem: IOffersUpdatesRow | null;
    sendModalOpen: boolean;
    itemActionLoading: string | null;
    markAllLoading: boolean;

    setSearch: (search: string) => void;
    setReadFilter: (filter: TReadFilter) => void;
    setSortValue: (sort: TSortValue) => void;
    setPage: (page: number) => void;
    setViewItem: (item: IOffersUpdatesRow | null) => void;
    setSendModalOpen: (open: boolean) => void;
    resetFilters: () => void;

    fetchNotifications: () => Promise<void>;
    markAsRead: (row: IOffersUpdatesRow) => Promise<void>;
    markAllOffersAsRead: () => Promise<void>;
    markAllUpdatesAsRead: () => Promise<void>;
}

const extractErrorMessage = (error: unknown, fallback: string): string => {
    if (!isAxiosError(error)) return fallback;
    return error.response?.data?.message || fallback;
};

const fetchAllPaged = async (
    endpoint: string,
    params: Record<string, unknown> = {},
): Promise<any[]> => {
    const limit = 100;
    let page = 1;
    let totalPages = 1;
    const allItems: any[] = [];

    do {
        const response = await axiosNormalApiClient.get(endpoint, { params: { ...params, page, limit } });
        const items = response.data?.data ?? [];
        const meta = response.data?.meta ?? {};
        allItems.push(...items);
        totalPages = Number(meta.total_pages ?? 1);
        page += 1;
    } while (page <= totalPages);

    return allItems;
};

const useOffersUpdatesNotificationsStore = create<OffersUpdatesNotificationsState>((set, get) => ({
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
        const { readFilter } = get();
        set({ loading: true, error: null });
        try {
            const isReadParam: Record<string, unknown> = {};
            if (readFilter === "read") isReadParam.is_read = true;
            if (readFilter === "unread") isReadParam.is_read = false;

            const [offersRaw, updatesRaw] = await Promise.allSettled([
                fetchAllPaged("/dashboard/offers-notifications", isReadParam),
                fetchAllPaged("/dashboard/updates-notifications", isReadParam),
            ]);

            const offersRows: IOffersUpdatesRow[] = offersRaw.status === "fulfilled"
                ? offersRaw.value.map((item: any) => ({
                    id: item.id,
                    row_key: `offer-${item.id}`,
                    source: "offer" as const,
                    title: item.title,
                    description: item.description,
                    target_audience: item.user_id ? `User #${item.user_id}` : "All Users",
                    sent_by: item.made_by_admin_id ? `Admin #${item.made_by_admin_id}` : "System",
                    created_at: item.created_at,
                    is_read: Boolean(item.is_read),
                    payload: item.payload ?? null,
                }))
                : [];

            const updatesRows: IOffersUpdatesRow[] = updatesRaw.status === "fulfilled"
                ? updatesRaw.value.map((item: any) => ({
                    id: item.id,
                    row_key: `update-${item.id}`,
                    source: "update" as const,
                    title: item.title,
                    description: item.description,
                    target_audience: item.user_id ? `User #${item.user_id}` : "All Users",
                    sent_by: item.made_by_admin_id ? `Admin #${item.made_by_admin_id}` : "System",
                    created_at: item.created_at,
                    is_read: Boolean(item.is_read),
                    payload: item.payload ?? null,
                }))
                : [];

            const { search, sortValue } = get();
            const lowerSearch = search.trim().toLowerCase();

            let rows = [...offersRows, ...updatesRows].filter((row) => {
                if (!lowerSearch) return true;
                return `${row.title} ${row.description}`.toLowerCase().includes(lowerSearch);
            });

            rows = rows.sort((a, b) => {
                if (sortValue === "created-desc") return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
                if (sortValue === "created-asc") return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
                if (sortValue === "title-asc") return a.title.localeCompare(b.title);
                if (sortValue === "title-desc") return b.title.localeCompare(a.title);
                return 0;
            });

            set({
                rows,
                meta: { total: rows.length, page: 1, limit: rows.length || 1, total_pages: 1 },
            });
        } catch (error) {
            set({ error: extractErrorMessage(error, "Failed to fetch offers & updates notifications") });
        } finally {
            set({ loading: false });
        }
    },

    markAsRead: async (row) => {
        const { itemActionLoading, fetchNotifications } = get();
        if (itemActionLoading) return;
        set({ itemActionLoading: row.row_key });
        try {
            const endpoint = row.source === "offer"
                ? `/dashboard/offers-notifications/${row.id}/read`
                : `/dashboard/updates-notifications/${row.id}/read`;
            await axiosNormalApiClient.patch(endpoint, {});
            await fetchNotifications();
        } finally {
            set({ itemActionLoading: null });
        }
    },

    markAllOffersAsRead: async () => {
        const { markAllLoading, fetchNotifications } = get();
        if (markAllLoading) return;
        set({ markAllLoading: true });
        try {
            await axiosNormalApiClient.patch("/dashboard/offers-notifications/read-all", {});
            await fetchNotifications();
        } finally {
            set({ markAllLoading: false });
        }
    },

    markAllUpdatesAsRead: async () => {
        const { markAllLoading, fetchNotifications } = get();
        if (markAllLoading) return;
        set({ markAllLoading: true });
        try {
            await axiosNormalApiClient.patch("/dashboard/updates-notifications/read-all", {});
            await fetchNotifications();
        } finally {
            set({ markAllLoading: false });
        }
    },
}));

export default useOffersUpdatesNotificationsStore;
