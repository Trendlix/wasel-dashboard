import { create } from "zustand";
import { isAxiosError } from "axios";
import axiosNormalApiClient from "@/shared/utils/axios";
import {
    type TNotificationDeliveryStatus,
    type TNotificationManagementTab,
} from "@/shared/core/pages/notifications";
import useDashboardNotificationsStore from "./useDashboardNotificationsStore";

export type TRowSource = "user" | "driver" | "trip" | "offer" | "update";
export type TDateFilter = "all" | "today" | "last7" | "last30";
export type TSortValue = "created-desc" | "created-asc" | "title-asc" | "title-desc";
export type TReadFilter = "all" | "read" | "unread";

export interface INotificationRow {
    id: number;
    row_key: string;
    source: TRowSource;
    tab: TNotificationManagementTab;
    title: string;
    description: string;
    target_audience: string;
    sent_by: string;
    created_at: string;
    status: TNotificationDeliveryStatus;
    is_read: boolean;
}

interface IAdminNotificationPayload {
    id: number;
    title: string;
    description: string;
    created_at: string;
    is_read?: boolean;
    read_at?: string | null;
    admin_id?: number;
    user_id?: number;
    driver_id?: number;
    trip_id?: number;
    payload?: Record<string, unknown> | null;
}

interface IOfferOrUpdatePayload {
    id: number;
    title: string;
    description: string;
    created_at: string;
    is_read?: boolean;
    payload?: Record<string, unknown> | null;
    user_id?: number;
    made_by_admin_id?: number;
}

const emptyRowsByTab: Record<TNotificationManagementTab, INotificationRow[]> = {
    "driver-admin": [],
    "user-admin": [],
    "trip-admin": [],
    "offers-updates": [],
};

const getDeliveryStatus = (payload?: Record<string, unknown> | null): TNotificationDeliveryStatus => {
    if (!payload) return "sent";
    if (payload.failed === true) return "failed";
    const scheduledAt = payload.scheduled_at;
    if (typeof scheduledAt === "string") {
        const parsed = new Date(scheduledAt);
        if (!Number.isNaN(parsed.getTime()) && parsed.getTime() > Date.now()) return "scheduled";
    }
    return "sent";
};

const extractErrorMessage = (error: unknown, fallback: string): string => {
    if (!isAxiosError(error)) return fallback;
    return error.response?.data?.message || fallback;
};

interface NotificationManagementState {
    rowsByTab: Record<TNotificationManagementTab, INotificationRow[]>;
    loading: boolean;
    error: string | null;

    activeTab: TNotificationManagementTab;
    search: string;
    dateFilter: TDateFilter;
    readFilter: TReadFilter;
    sortValue: TSortValue;
    page: number;

    viewItem: INotificationRow | null;
    sendModalOpen: boolean;
    sendModalInitial: { tab: TNotificationManagementTab; title: string; message: string };

    itemActionLoading: string | null;
    markAllLoading: boolean;

    setActiveTab: (tab: TNotificationManagementTab) => void;
    setSearch: (search: string) => void;
    setDateFilter: (filter: TDateFilter) => void;
    setReadFilter: (filter: TReadFilter) => void;
    setSortValue: (sort: TSortValue) => void;
    setPage: (page: number) => void;
    setViewItem: (item: INotificationRow | null) => void;
    setSendModalOpen: (open: boolean) => void;
    setSendModalInitial: (initial: { tab: TNotificationManagementTab; title: string; message: string }) => void;
    resetFilters: () => void;

    fetchNotifications: () => Promise<void>;
    markAsRead: (row: INotificationRow) => Promise<void>;
    handleMarkAllAsRead: () => Promise<void>;
}

const fetchAllPagedNotifications = async (
    endpoint: "/dashboard/offers-notifications" | "/dashboard/updates-notifications",
): Promise<IOfferOrUpdatePayload[]> => {
    const limit = 100;
    let page = 1;
    let totalPages = 1;
    const allItems: IOfferOrUpdatePayload[] = [];

    do {
        const response = await axiosNormalApiClient.get(endpoint, { params: { page, limit } });
        const items = (response.data?.data ?? []) as IOfferOrUpdatePayload[];
        const meta = response.data?.meta ?? {};
        allItems.push(...items);
        totalPages = Number(meta.total_pages ?? 1);
        page += 1;
    } while (page <= totalPages);

    return allItems;
};

const toStoreTab = (tab: TNotificationManagementTab): "user" | "driver" | "trip" | null => {
    if (tab === "user-admin") return "user";
    if (tab === "driver-admin") return "driver";
    if (tab === "trip-admin") return "trip";
    return null;
};

const useNotificationManagementStore = create<NotificationManagementState>((set, get) => ({
    rowsByTab: { ...emptyRowsByTab },
    loading: false,
    error: null,

    activeTab: "driver-admin",
    search: "",
    dateFilter: "all",
    readFilter: "all",
    sortValue: "created-desc",
    page: 1,

    viewItem: null,
    sendModalOpen: false,
    sendModalInitial: { tab: "user-admin", title: "", message: "" },

    itemActionLoading: null,
    markAllLoading: false,

    setActiveTab: (tab) => set({ activeTab: tab, page: 1 }),
    setSearch: (search) => set({ search, page: 1 }),
    setDateFilter: (dateFilter) => set({ dateFilter, page: 1 }),
    setReadFilter: (readFilter) => set({ readFilter, page: 1 }),
    setSortValue: (sortValue) => set({ sortValue, page: 1 }),
    setPage: (page) => set({ page }),
    setViewItem: (viewItem) => set({ viewItem }),
    setSendModalOpen: (sendModalOpen) => set({ sendModalOpen }),
    setSendModalInitial: (sendModalInitial) => set({ sendModalInitial }),
    resetFilters: () => set({ search: "", dateFilter: "all", readFilter: "all", sortValue: "created-desc", page: 1 }),

    fetchNotifications: async () => {
        set({ loading: true });
        try {
            const [adminResult, offersResult, updatesResult] = await Promise.allSettled([
                axiosNormalApiClient.get("/dashboard/notifications"),
                fetchAllPagedNotifications("/dashboard/offers-notifications"),
                fetchAllPagedNotifications("/dashboard/updates-notifications"),
            ]);

            const nextRows: Record<TNotificationManagementTab, INotificationRow[]> = { ...emptyRowsByTab };

            if (adminResult.status === "fulfilled") {
                const payload = adminResult.value.data?.data ?? {};
                const users = (payload.user ?? []) as IAdminNotificationPayload[];
                const drivers = (payload.driver ?? []) as IAdminNotificationPayload[];
                const trips = (payload.trip ?? []) as IAdminNotificationPayload[];

                nextRows["user-admin"] = users.map((item) => ({
                    id: item.id,
                    row_key: `user-${item.id}`,
                    source: "user",
                    tab: "user-admin",
                    title: item.title,
                    description: item.description,
                    target_audience: item.user_id ? `Specific User #${item.user_id}` : "Users",
                    sent_by: item.admin_id ? `Admin #${item.admin_id}` : "System",
                    created_at: item.created_at,
                    status: getDeliveryStatus(item.payload),
                    is_read: Boolean(item.is_read ?? item.read_at),
                }));

                nextRows["driver-admin"] = drivers.map((item) => ({
                    id: item.id,
                    row_key: `driver-${item.id}`,
                    source: "driver",
                    tab: "driver-admin",
                    title: item.title,
                    description: item.description,
                    target_audience: item.driver_id ? `Specific Driver #${item.driver_id}` : "Drivers",
                    sent_by: item.admin_id ? `Admin #${item.admin_id}` : "System",
                    created_at: item.created_at,
                    status: getDeliveryStatus(item.payload),
                    is_read: Boolean(item.is_read ?? item.read_at),
                }));

                nextRows["trip-admin"] = trips.map((item) => ({
                    id: item.id,
                    row_key: `trip-${item.id}`,
                    source: "trip",
                    tab: "trip-admin",
                    title: item.title,
                    description: item.description,
                    target_audience: item.trip_id ? `Specific Trip #${item.trip_id}` : "Trips",
                    sent_by: item.admin_id ? `Admin #${item.admin_id}` : "System",
                    created_at: item.created_at,
                    status: getDeliveryStatus(item.payload),
                    is_read: Boolean(item.is_read ?? item.read_at),
                }));
            }

            const offersRows = offersResult.status === "fulfilled"
                ? offersResult.value.map((item) => ({
                    id: item.id,
                    row_key: `offer-${item.id}`,
                    source: "offer" as const,
                    tab: "offers-updates" as const,
                    title: item.title,
                    description: item.description,
                    target_audience: item.user_id ? `Specific User #${item.user_id}` : "Users",
                    sent_by: item.made_by_admin_id ? `Admin #${item.made_by_admin_id}` : "System",
                    created_at: item.created_at,
                    status: getDeliveryStatus(item.payload),
                    is_read: Boolean(item.is_read),
                }))
                : [];

            const updatesRows = updatesResult.status === "fulfilled"
                ? updatesResult.value.map((item) => ({
                    id: item.id,
                    row_key: `update-${item.id}`,
                    source: "update" as const,
                    tab: "offers-updates" as const,
                    title: item.title,
                    description: item.description,
                    target_audience: item.user_id ? `Specific User #${item.user_id}` : "Users",
                    sent_by: item.made_by_admin_id ? `Admin #${item.made_by_admin_id}` : "System",
                    created_at: item.created_at,
                    status: getDeliveryStatus(item.payload),
                    is_read: Boolean(item.is_read),
                }))
                : [];

            nextRows["offers-updates"] = [...offersRows, ...updatesRows].sort(
                (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
            );

            set({ rowsByTab: nextRows });
            await useDashboardNotificationsStore.getState().fetchNotificationsCount();
        } catch (error) {
            set({ error: extractErrorMessage(error, "Failed to fetch notifications") });
        } finally {
            set({ loading: false });
        }
    },

    markAsRead: async (row) => {
        const { itemActionLoading, fetchNotifications } = get();
        if (row.is_read || itemActionLoading) return;
        set({ itemActionLoading: row.row_key });
        try {
            if (row.source === "user" || row.source === "driver" || row.source === "trip") {
                await useDashboardNotificationsStore.getState().markNotificationItemAsRead(row.source, row.id);
            } else if (row.source === "offer") {
                await axiosNormalApiClient.patch(`/dashboard/offers-notifications/${row.id}/read`, {});
            } else {
                await axiosNormalApiClient.patch(`/dashboard/updates-notifications/${row.id}/read`, {});
            }
            await fetchNotifications();
        } finally {
            set({ itemActionLoading: null });
        }
    },

    handleMarkAllAsRead: async () => {
        const { activeTab, markAllLoading, fetchNotifications } = get();
        if (markAllLoading) return;
        set({ markAllLoading: true });
        try {
            if (activeTab === "offers-updates") {
                await Promise.all([
                    axiosNormalApiClient.patch("/dashboard/offers-notifications/read-all", {}),
                    axiosNormalApiClient.patch("/dashboard/updates-notifications/read-all", {}),
                ]);
            } else {
                const storeTab = toStoreTab(activeTab);
                if (!storeTab) return;
                await useDashboardNotificationsStore.getState().markTabNotificationsAsRead(storeTab);
            }
            await fetchNotifications();
        } finally {
            set({ markAllLoading: false });
        }
    },
}));

export { toStoreTab };
export default useNotificationManagementStore;
