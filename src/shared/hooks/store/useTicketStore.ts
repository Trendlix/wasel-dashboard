import { create } from "zustand";
import axiosNormalApiClient from "@/shared/utils/axios";
import { isAxiosError } from "axios";
import { io, type Socket } from "socket.io-client";
import { getCookie } from "@/shared/utils/cookieUtils";
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
    initializeSupportSocket: (adminId: number) => void;
    teardownSupportSocket: () => void;
    appendSupportMessage: (ticketId: number, support: ITicketSupport) => void;

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

        supportSocket.on("support:count", (payload: { total: number; unread: number }) => {
            set({ supportUnreadCount: payload?.unread ?? 0 });
        });

        supportSocket.on(
            "support_notification:new",
            () => {
                useTicketStore.getState().fetchStats();
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
        supportSocket.disconnect();
        supportSocket = null;
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
        const response = await axiosNormalApiClient.post(`/ticket/${id}/reply`, { title, description });
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
}));

export default useTicketStore;
