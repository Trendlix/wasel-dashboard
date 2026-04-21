import { create } from "zustand";
import axiosNormalApiClient from "@/shared/utils/axios";
import { isAxiosError } from "axios";
import { io, type Socket } from "socket.io-client";
import { getCookie } from "@/shared/utils/cookieUtils";
import { showToast } from "@/shared/utils/toast";
import type {
    ITicket,
    ITicketCategory,
    ITicketDetail,
    ITicketQuery,
    ITicketStats,
    ITicketSupport,
} from "@/shared/core/pages/supportTickets";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ITicketPaginationMeta {
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

export interface ISupportNotification {
    id: number;
    ticket_id: number;
    ticket_subject: string | null;
    ticket_status: string | null;
    triggered_by_user_id: number | null;
    triggered_by_user_name: string | null;
    triggered_by_driver_id: number | null;
    triggered_by_driver_name: string | null;
    triggeredByType: "user" | "driver";
    triggeredById: number | null;
    triggeredByName: string | null;
    type: string;
    color: string;
    title: string;
    description: string;
    created_at: string;
    is_read: boolean;
    read_at: string | null;
}

// ─── Support socket (module-level singleton) ──────────────────────────────────

let supportSocket: Socket | null = null;

/** Exposed so TicketReplyPage can attach ticket-scoped listeners without reconnecting. */
export const getSupportSocket = () => supportSocket;

// ─── State ────────────────────────────────────────────────────────────────────

interface TicketState {
    tickets: ITicket[];
    meta: ITicketPaginationMeta | null;
    stats: ITicketStats | null;
    statsLoading: boolean;
    loading: boolean;
    error: string | null;
    query: ITicketQuery;

    // categories
    categories: ITicketCategory[];
    categoriesLoading: boolean;
    categorySaving: boolean;

    // detail
    selectedTicket: ITicketDetail | null;
    detailLoading: boolean;

    // support socket
    supportUnreadCount: number;
    activeSupportChatTicketId: number | null;
    initializeSupportSocket: (adminId: number) => void;
    teardownSupportSocket: () => void;
    appendSupportMessage: (ticketId: number, support: ITicketSupport) => void;
    setActiveSupportChatTicket: (ticketId: number) => void;
    clearActiveSupportChatTicket: (ticketId?: number) => void;

    // support notifications
    supportNotifications: ISupportNotification[];
    supportNotificationsLoading: boolean;
    supportNotificationsMeta: ITicketPaginationMeta | null;
    fetchSupportNotifications: (page?: number) => Promise<void>;
    markSupportNotificationAsRead: (id: number) => Promise<void>;
    markAllSupportNotificationsAsRead: () => Promise<void>;
    markSupportNotificationsForTicketAsRead: (ticketId: number) => Promise<void>;
    prependSupportNotification: (notification: Partial<ISupportNotification>) => void;

    fetchTickets: (query?: ITicketQuery) => Promise<void>;
    fetchStats: () => Promise<void>;
    setPage: (page: number) => void;
    setQuery: (partial: Partial<ITicketQuery>) => void;
    resetQuery: () => void;

    fetchCategories: () => Promise<void>;
    createCategory: (name: string) => Promise<void>;
    deleteCategory: (id: number) => Promise<void>;

    fetchTicketDetail: (id: number) => Promise<void>;
    closeTicket: (id: number) => Promise<void>;
    solveTicket: (id: number) => Promise<void>;
    replyOnTicket: (id: number, title: string, description: string) => Promise<void>;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const extractErrorMessage = (error: unknown, fallback: string): string => {
    if (!isAxiosError(error)) return fallback;
    return error.response?.data?.message || fallback;
};

const defaultQuery: ITicketQuery = {
    page: 1,
    limit: 10,
    sorting: "desc",
};

// ─── Support notification sound ──────────────────────────────────────────────

let supportNotificationAudio: HTMLAudioElement | null = null;
let isSupportAudioUnlocked = false;

const ensureSupportAudioUnlocked = () => {
    if (typeof window === "undefined" || isSupportAudioUnlocked) return;

    const unlock = () => {
        if (!supportNotificationAudio) return;
        supportNotificationAudio
            .play()
            .then(() => {
                supportNotificationAudio?.pause();
                if (supportNotificationAudio) supportNotificationAudio.currentTime = 0;
                isSupportAudioUnlocked = true;
            })
            .catch(() => {})
            .finally(() => {
                window.removeEventListener("pointerdown", unlock);
            });
    };

    window.addEventListener("pointerdown", unlock, { once: true });
};

const playSupportNotificationSound = () => {
    if (typeof window === "undefined") return;
    if (!supportNotificationAudio) {
        supportNotificationAudio = new Audio("/sound/mixkit-digital-quick-tone-2866.wav");
        supportNotificationAudio.preload = "auto";
        supportNotificationAudio.volume = 1;
        ensureSupportAudioUnlocked();
    }

    const player = supportNotificationAudio.cloneNode(true) as HTMLAudioElement;
    player.volume = 1;
    void player.play().catch(() => {});
};

// ─── Store ────────────────────────────────────────────────────────────────────

const useTicketStore = create<TicketState>((set, get) => ({
    tickets: [],
    meta: null,
    stats: null,
    statsLoading: false,
    loading: false,
    error: null,
    query: defaultQuery,

    categories: [],
    categoriesLoading: false,
    categorySaving: false,

    selectedTicket: null,
    detailLoading: false,

    supportUnreadCount: 0,
    activeSupportChatTicketId: null,
    supportNotifications: [],
    supportNotificationsLoading: false,
    supportNotificationsMeta: null,

    // ── Support socket ──────────────────────────────────────────────────────

    initializeSupportSocket: (adminId: number) => {
        if (supportSocket) return;

        const token = getCookie("wasel_admin_access_token");
        const apiBase = import.meta.env.VITE_API_BASE_URL;
        const baseURL = apiBase
            ? new URL(apiBase, window.location.origin).origin
            : window.location.origin;

        supportSocket = io(`${baseURL}/admin/support`, {
            transports: ["websocket", "polling"],
            withCredentials: true,
            auth: { ...(token ? { token } : {}), admin_id: adminId },
            query: { admin_id: adminId },
        });

        supportSocket.on("connect", () => {
            const activeTicketId = useTicketStore.getState().activeSupportChatTicketId;
            if (!activeTicketId) return;
            supportSocket?.emit("ticket:chat_presence", {
                ticket_id: activeTicketId,
                active: true,
            });
        });

        supportSocket.on("support:count", (payload: { total: number; unread: number }) => {
            set({ supportUnreadCount: payload?.unread ?? 0 });
        });

        supportSocket.on(
            "support_notification:new",
            (payload: { title?: string; description?: string; ticket_id?: number; user_id?: number; driver_id?: number; type?: string }) => {
                const state = useTicketStore.getState();
                const activeTicketId = state.activeSupportChatTicketId;
                const incomingTicketId = Number(payload?.ticket_id);
                if (
                    activeTicketId !== null &&
                    Number.isInteger(incomingTicketId) &&
                    incomingTicketId > 0 &&
                    incomingTicketId === activeTicketId
                ) {
                    return;
                }
                playSupportNotificationSound();
                showToast(payload?.title || "New support activity", "info");
                state.fetchStats();
                state.fetchTickets();
                state.fetchSupportNotifications();
            }
        );

        supportSocket.on(
            "ticket:new_message",
            (payload: { ticketId: number; support: ITicketSupport }) => {
                useTicketStore.getState().appendSupportMessage(payload.ticketId, payload.support);
            }
        );

        supportSocket.on("connect_error", (err) => {
            console.error("Support socket connect_error:", err?.message ?? err);
        });
    },

    teardownSupportSocket: () => {
        if (!supportSocket) return;
        const activeTicketId = get().activeSupportChatTicketId;
        if (activeTicketId) {
            supportSocket.emit("ticket:chat_presence", {
                ticket_id: activeTicketId,
                active: false,
            });
        }
        supportSocket.disconnect();
        supportSocket = null;
        set({ activeSupportChatTicketId: null });
    },

    appendSupportMessage: (ticketId, support) => {
        set((state) => {
            if (!state.selectedTicket || state.selectedTicket.id !== ticketId) return {};
            // Avoid duplicates
            const already = state.selectedTicket.supports.some((s) => s.id === support.id);
            if (already) return {};
            return {
                selectedTicket: {
                    ...state.selectedTicket,
                    supports: [...state.selectedTicket.supports, support],
                },
            };
        });
    },

    setActiveSupportChatTicket: (ticketId) => {
        set({ activeSupportChatTicketId: ticketId });
        if (supportSocket?.connected) {
            supportSocket.emit("ticket:chat_presence", {
                ticket_id: ticketId,
                active: true,
            });
        }
    },

    clearActiveSupportChatTicket: (ticketId) => {
        const activeTicketId = get().activeSupportChatTicketId;
        if (ticketId && activeTicketId !== ticketId) return;

        const ticketIdToClear = ticketId ?? activeTicketId;
        set({ activeSupportChatTicketId: null });
        if (supportSocket?.connected && ticketIdToClear) {
            supportSocket.emit("ticket:chat_presence", {
                ticket_id: ticketIdToClear,
                active: false,
            });
        }
    },

    fetchTickets: async (query) => {
        const params = query ?? get().query;
        // Strip undefined values so they don't end up as "undefined" string in query params
        const cleanParams = Object.fromEntries(
            Object.entries(params).filter(([, v]) => v !== undefined)
        );
        set({ loading: true, error: null });
        try {
            const response = await axiosNormalApiClient.get("/ticket", { params: cleanParams });
            set({
                tickets: response.data.data,
                meta: response.data.meta,
                loading: false,
            });
        } catch (error) {
            set({
                error: extractErrorMessage(error, "Failed to fetch tickets"),
                loading: false,
            });
        }
    },

    fetchStats: async () => {
        set({ statsLoading: true });
        try {
            const response = await axiosNormalApiClient.get("/ticket/stats");
            set({ stats: response.data.data, statsLoading: false });
        } catch (error) {
            set({ statsLoading: false });
        }
    },

    setPage: (page) => {
        const next = { ...get().query, page };
        set({ query: next });
        get().fetchTickets(next);
    },

    setQuery: (partial) => {
        const next = { ...get().query, ...partial, page: 1 };
        set({ query: next });
        get().fetchTickets(next);
    },

    resetQuery: () => {
        set({ query: defaultQuery });
        get().fetchTickets(defaultQuery);
    },

    // ── Categories ──────────────────────────────────────────────────────────

    fetchCategories: async () => {
        set({ categoriesLoading: true });
        try {
            const response = await axiosNormalApiClient.get("/ticket-category");
            set({ categories: response.data.data, categoriesLoading: false });
        } catch {
            set({ categoriesLoading: false });
        }
    },

    createCategory: async (name) => {
        set({ categorySaving: true });
        try {
            const response = await axiosNormalApiClient.post("/ticket-category", { name });
            const newCat: ITicketCategory = { ...response.data.data, ticket_count: 0 };
            set((state) => ({
                categories: [...state.categories, newCat],
                categorySaving: false,
            }));
        } catch (error) {
            set({ categorySaving: false });
            throw error;
        }
    },

    deleteCategory: async (id) => {
        await axiosNormalApiClient.delete(`/ticket-category/${id}`);
        set((state) => ({
            categories: state.categories.filter((c) => c.id !== id),
        }));
    },

    // ── Detail ──────────────────────────────────────────────────────────────

    fetchTicketDetail: async (id) => {
        set({ detailLoading: true, selectedTicket: null });
        try {
            const response = await axiosNormalApiClient.get(`/ticket/${id}`);
            set({ selectedTicket: response.data.data, detailLoading: false });
        } catch {
            set({ detailLoading: false });
        }
    },

    closeTicket: async (id) => {
        await axiosNormalApiClient.patch(`/ticket/${id}/close`);
        // Optimistically update list and detail
        set((state) => ({
            tickets: state.tickets.map((t) =>
                t.id === id ? { ...t, status: "closed" as const } : t
            ),
            selectedTicket:
                state.selectedTicket?.id === id
                    ? { ...state.selectedTicket, status: "closed" as const }
                    : state.selectedTicket,
        }));
        get().fetchStats();
    },

    solveTicket: async (id) => {
        await axiosNormalApiClient.patch(`/ticket/${id}/solve`);
        set((state) => ({
            tickets: state.tickets.map((t) =>
                t.id === id ? { ...t, status: "solved" as const } : t
            ),
            selectedTicket:
                state.selectedTicket?.id === id
                    ? { ...state.selectedTicket, status: "solved" as const }
                    : state.selectedTicket,
        }));
        get().fetchStats();
    },

    replyOnTicket: async (id, title, description) => {
        const response = await axiosNormalApiClient.post(
            `/ticket/${id}/reply`,
            { title, description },
            { meta: { showToast: false } },
        );
        const support = response.data?.data?.support as ITicketSupport | undefined;

        set((state) => ({
            tickets: state.tickets.map((t) =>
                t.id === id ? { ...t, status: "reply" as const } : t
            ),
        }));

        // Optimistically append the reply — no full refetch, no flash
        if (support) {
            get().appendSupportMessage(id, support);
        }

        get().fetchStats();
    },

    // ── Support Notifications ────────────────────────────────────────────────

    fetchSupportNotifications: async (page = 1) => {
        set({ supportNotificationsLoading: true });
        try {
            const response = await axiosNormalApiClient.get("/ticket/notifications", {
                params: { page, limit: 20 },
            });
            set({
                supportNotifications: response.data.data ?? [],
                supportNotificationsMeta: response.data.meta ?? null,
                supportNotificationsLoading: false,
            });
        } catch {
            set({ supportNotificationsLoading: false });
        }
    },

    markSupportNotificationAsRead: async (id) => {
        try {
            await axiosNormalApiClient.patch(`/ticket/notifications/${id}/mark-as-read`);
            set((state) => ({
                supportNotifications: state.supportNotifications.map((n) =>
                    n.id === id ? { ...n, is_read: true, read_at: new Date().toISOString() } : n
                ),
            }));
        } catch {
            // silently fail
        }
    },

    markAllSupportNotificationsAsRead: async () => {
        try {
            await axiosNormalApiClient.patch("/ticket/notifications/mark-all-as-read");
            set((state) => ({
                supportNotifications: state.supportNotifications.map((n) => ({
                    ...n,
                    is_read: true,
                    read_at: n.read_at ?? new Date().toISOString(),
                })),
            }));
        } catch {
            // silently fail
        }
    },

    markSupportNotificationsForTicketAsRead: async (ticketId) => {
        try {
            await axiosNormalApiClient.patch(
                `/ticket/notifications/ticket/${ticketId}/mark-as-read`,
                {},
                { meta: { showToast: false } },
            );
            set((state) => ({
                supportNotifications: state.supportNotifications.map((n) =>
                    n.ticket_id === ticketId
                        ? { ...n, is_read: true, read_at: n.read_at ?? new Date().toISOString() }
                        : n
                ),
            }));
        } catch {
            // silently fail
        }
    },

    prependSupportNotification: (notification) => {
        set((state) => {
            const exists = state.supportNotifications.some((n) => n.id === notification.id);
            if (exists) return {};
            const newNotification: ISupportNotification = {
                id: notification.id ?? Date.now(),
                ticket_id: notification.ticket_id ?? 0,
                ticket_subject: notification.ticket_subject ?? null,
                ticket_status: notification.ticket_status ?? null,
                triggered_by_user_id: notification.triggered_by_user_id ?? null,
                triggered_by_user_name: notification.triggered_by_user_name ?? null,
                triggered_by_driver_id: notification.triggered_by_driver_id ?? null,
                triggered_by_driver_name: notification.triggered_by_driver_name ?? null,
                triggeredByType: (notification.triggeredByType as "user" | "driver") ?? "user",
                triggeredById: notification.triggeredById ?? null,
                triggeredByName: notification.triggeredByName ?? null,
                type: notification.type ?? "new_ticket",
                color: notification.color ?? "blue",
                title: notification.title ?? "",
                description: notification.description ?? "",
                created_at: notification.created_at ?? new Date().toISOString(),
                is_read: false,
                read_at: null,
            };
            return {
                supportNotifications: [newNotification, ...state.supportNotifications].slice(0, 50),
            };
        });
    },
}));

export default useTicketStore;
