import { create } from "zustand";
import { isAxiosError } from "axios";
import axiosNormalApiClient from "@/shared/utils/axios";

export type TOffersUpdatesSource = "offer" | "update";
export type TSortValue = "created-desc" | "created-asc" | "title-asc" | "title-desc";

export interface IOffersUpdatesRow {
    id: number | null;
    row_key: string;
    campaign_id: string;
    source: TOffersUpdatesSource;
    title: string;
    description: string;
    sent_users_count: number;
    sent_by: string;
    created_at: string;
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
    sortValue: TSortValue;
    page: number;
    limit: number;

    sendModalOpen: boolean;

    setSearch: (search: string) => void;
    setSortValue: (sort: TSortValue) => void;
    setPage: (page: number) => void;
    setSendModalOpen: (open: boolean) => void;
    resetFilters: () => void;

    fetchNotifications: () => Promise<void>;
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

const useOffersUpdatesNotificationsStore = create<OffersUpdatesNotificationsState>((set) => ({
    rows: [],
    meta: { total: 0, page: 1, limit: 15, total_pages: 1 },
    loading: false,
    error: null,

    search: "",
    sortValue: "created-desc",
    page: 1,
    limit: 15,

    sendModalOpen: false,

    setSearch: (search) => set({ search, page: 1 }),
    setSortValue: (sortValue) => set({ sortValue, page: 1 }),
    setPage: (page) => set({ page }),
    setSendModalOpen: (sendModalOpen) => set({ sendModalOpen }),
    resetFilters: () => set({ search: "", sortValue: "created-desc", page: 1 }),

    fetchNotifications: async () => {
        set({ loading: true, error: null });
        try {
            const [offersRaw, updatesRaw] = await Promise.allSettled([
                fetchAllPaged("/dashboard/offers-notifications/campaigns"),
                fetchAllPaged("/dashboard/updates-notifications/campaigns"),
            ]);

            const offersRows: IOffersUpdatesRow[] = offersRaw.status === "fulfilled"
                ? offersRaw.value.map((item: any) => ({
                    id: item.latest_notification_id ?? null,
                    row_key: `offer-${item.campaign_id}`,
                    campaign_id: item.campaign_id,
                    source: "offer" as const,
                    title: item.title,
                    description: item.description,
                    sent_users_count: Number(item.sent_users_count ?? 0),
                    sent_by: item.made_by_admin_id ? `Admin #${item.made_by_admin_id}` : "System",
                    created_at: item.created_at,
                    payload: item.payload ?? null,
                }))
                : [];

            const updatesRows: IOffersUpdatesRow[] = updatesRaw.status === "fulfilled"
                ? updatesRaw.value.map((item: any) => ({
                    id: item.latest_notification_id ?? null,
                    row_key: `update-${item.campaign_id}`,
                    campaign_id: item.campaign_id,
                    source: "update" as const,
                    title: item.title,
                    description: item.description,
                    sent_users_count: Number(item.sent_users_count ?? 0),
                    sent_by: item.made_by_admin_id ? `Admin #${item.made_by_admin_id}` : "System",
                    created_at: item.created_at,
                    payload: item.payload ?? null,
                }))
                : [];

            const rows = [...offersRows, ...updatesRows];

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
}));

export default useOffersUpdatesNotificationsStore;
