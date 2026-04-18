import { create } from "zustand";
import { isAxiosError } from "axios";
import axiosNormalApiClient from "@/shared/utils/axios";
import { getCookie } from "@/shared/utils/cookieUtils";
import { io, type Socket } from "socket.io-client";
import { showToast } from "@/shared/utils/toast";

export type TDashboardNotificationTab = "user" | "driver" | "trip";

export interface IAdminDashboardNotification {
  id: number;
  title: string;
  description: string;
  created_at: string;
  is_read?: boolean;
  read_at: string | null;
}

interface IDashboardNotificationsResponse {
  user: IAdminDashboardNotification[];
  driver: IAdminDashboardNotification[];
  trip: IAdminDashboardNotification[];
}

interface IDashboardNotificationsCount {
  total: number;
  unread_total: number;
  by_type: {
    user: number;
    driver: number;
    trip: number;
  };
  unread_by_type: {
    user: number;
    driver: number;
    trip: number;
  };
}

interface DashboardNotificationsState {
  notifications: IDashboardNotificationsResponse;
  counts: IDashboardNotificationsCount;
  loading: boolean;
  error: string | null;
  activeTab: TDashboardNotificationTab;
  fetchNotifications: () => Promise<void>;
  fetchNotificationsCount: () => Promise<void>;
  markAllNotificationsAsRead: () => Promise<void>;
  markTabNotificationsAsRead: (tab: TDashboardNotificationTab) => Promise<void>;
  markNotificationItemAsRead: (tab: TDashboardNotificationTab, id: number) => Promise<void>;
  initializeRealtime: () => void;
  teardownRealtime: () => void;
  setActiveTab: (tab: TDashboardNotificationTab) => void;
}

const extractErrorMessage = (error: unknown, fallback: string): string => {
  if (isAxiosError(error) === false) return fallback;
  return error.response?.data?.message || fallback;
};

const emptyNotifications: IDashboardNotificationsResponse = {
  user: [],
  driver: [],
  trip: [],
};

const defaultCounts: IDashboardNotificationsCount = {
  total: 0,
  unread_total: 0,
  by_type: { user: 0, driver: 0, trip: 0 },
  unread_by_type: { user: 0, driver: 0, trip: 0 },
};

let dashboardNotificationsSocket: Socket | null = null;
let dashboardNotificationAudio: HTMLAudioElement | null = null;
let isDashboardAudioUnlocked = false;

const ensureDashboardAudioUnlocked = () => {
  if (typeof window === "undefined" || isDashboardAudioUnlocked) return;

  const unlock = () => {
    if (!dashboardNotificationAudio) return;
    dashboardNotificationAudio
      .play()
      .then(() => {
        dashboardNotificationAudio?.pause();
        if (dashboardNotificationAudio) dashboardNotificationAudio.currentTime = 0;
        isDashboardAudioUnlocked = true;
      })
      .catch(() => {
        // User interaction may still be required in some browsers.
      })
      .finally(() => {
        window.removeEventListener("pointerdown", unlock);
      });
  };

  window.addEventListener("pointerdown", unlock, { once: true });
};

const playDashboardNotificationSound = () => {
  if (typeof window === "undefined") return;
  if (!dashboardNotificationAudio) {
    dashboardNotificationAudio = new Audio("/sound/mixkit-digital-quick-tone-2866.wav");
    dashboardNotificationAudio.preload = "auto";
    dashboardNotificationAudio.volume = 1;
    ensureDashboardAudioUnlocked();
  }

  // Clone for reliable replay when notifications arrive close together.
  const player = dashboardNotificationAudio.cloneNode(true) as HTMLAudioElement;
  player.volume = 1;
  void player.play().catch(() => {
    // Ignore autoplay/browser policy errors in background tabs.
  });
};

const useDashboardNotificationsStore = create<DashboardNotificationsState>((set) => ({
  notifications: emptyNotifications,
  counts: defaultCounts,
  loading: false,
  error: null,
  activeTab: "user",

  fetchNotifications: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axiosNormalApiClient.get("/dashboard/notifications");
      const data = response.data?.data ?? emptyNotifications;
      set({
        notifications: {
          user: data.user ?? [],
          driver: data.driver ?? [],
          trip: data.trip ?? [],
        },
        loading: false,
      });
    } catch (error) {
      set({
        error: extractErrorMessage(error, "Failed to fetch notifications"),
        loading: false,
      });
    }
  },

  fetchNotificationsCount: async () => {
    try {
      const response = await axiosNormalApiClient.get("/dashboard/notifications/count");
      const data = response.data?.data ?? defaultCounts;
      set({
        counts: {
          total: data.total ?? 0,
          unread_total: data.unread_total ?? 0,
          by_type: {
            user: data.by_type?.user ?? 0,
            driver: data.by_type?.driver ?? 0,
            trip: data.by_type?.trip ?? 0,
          },
          unread_by_type: {
            user: data.unread_by_type?.user ?? 0,
            driver: data.unread_by_type?.driver ?? 0,
            trip: data.unread_by_type?.trip ?? 0,
          },
        },
      });
    } catch {
      // keep existing counts on transient failures
    }
  },

  markAllNotificationsAsRead: async () => {
    try {
      await axiosNormalApiClient.patch(
        "/dashboard/notifications/mark-all-as-read",
        {},
        { meta: { showToast: true, toastType: "success" } },
      );
      await Promise.all([
        useDashboardNotificationsStore.getState().fetchNotifications(),
        useDashboardNotificationsStore.getState().fetchNotificationsCount(),
      ]);
    } catch (error) {
      set({ error: extractErrorMessage(error, "Failed to mark all notifications as read") });
      throw error;
    }
  },

  markTabNotificationsAsRead: async (tab) => {
    try {
      await axiosNormalApiClient.patch(
        `/dashboard/notifications/${tab}/mark-all-as-read`,
        {},
        { meta: { showToast: true, toastType: "success" } },
      );
      await Promise.all([
        useDashboardNotificationsStore.getState().fetchNotifications(),
        useDashboardNotificationsStore.getState().fetchNotificationsCount(),
      ]);
    } catch (error) {
      set({ error: extractErrorMessage(error, "Failed to mark tab notifications as read") });
      throw error;
    }
  },

  markNotificationItemAsRead: async (tab, id) => {
    try {
      await axiosNormalApiClient.patch(
        `/dashboard/notifications/${tab}/${id}/mark-as-read`,
        {},
        { meta: { showToast: true, toastType: "success" } },
      );
      await Promise.all([
        useDashboardNotificationsStore.getState().fetchNotifications(),
        useDashboardNotificationsStore.getState().fetchNotificationsCount(),
      ]);
    } catch (error) {
      set({ error: extractErrorMessage(error, "Failed to mark notification as read") });
      throw error;
    }
  },

  initializeRealtime: () => {
    if (dashboardNotificationsSocket) return;

    const token = getCookie("wasel_admin_access_token");
    const apiBase = import.meta.env.VITE_API_BASE_URL;
    const baseURL = apiBase
      ? new URL(apiBase, window.location.origin).origin
      : window.location.origin;

    dashboardNotificationsSocket = io(`${baseURL}/admin`, {
      // Keep websocket preferred but allow fallback to polling in local/dev envs.
      transports: ["websocket", "polling"],
      withCredentials: true,
      auth: token ? { token } : undefined,
    });

    if (typeof window !== "undefined") {
      (window as any).__dashboardSocket = dashboardNotificationsSocket;
    }

    const refreshData = async () => {
      await Promise.all([
        useDashboardNotificationsStore.getState().fetchNotificationsCount(),
        useDashboardNotificationsStore.getState().fetchNotifications(),
      ]);
    };

    dashboardNotificationsSocket.on("dashboard:notifications:count", (payload: IDashboardNotificationsCount) => {
      set({
        counts: {
          total: payload?.total ?? 0,
          unread_total: payload?.unread_total ?? 0,
          by_type: {
            user: payload?.by_type?.user ?? 0,
            driver: payload?.by_type?.driver ?? 0,
            trip: payload?.by_type?.trip ?? 0,
          },
          unread_by_type: {
            user: payload?.unread_by_type?.user ?? 0,
            driver: payload?.unread_by_type?.driver ?? 0,
            trip: payload?.unread_by_type?.trip ?? 0,
          },
        },
      });
    });

    dashboardNotificationsSocket.on("dashboard:notification:user:new", refreshData);
    dashboardNotificationsSocket.on("dashboard:notification:driver:new", refreshData);
    dashboardNotificationsSocket.on("dashboard:notification:trip:new", refreshData);
    dashboardNotificationsSocket.on("dashboard:notification:user:new", (payload: { title?: string; description?: string }) => {
      playDashboardNotificationSound();
      showToast(payload?.title || "New user notification", "info");
    });
    dashboardNotificationsSocket.on("dashboard:notification:driver:new", (payload: { title?: string; description?: string }) => {
      playDashboardNotificationSound();
      showToast(payload?.title || "New driver notification", "info");
    });
    dashboardNotificationsSocket.on("dashboard:notification:trip:new", (payload: { title?: string; description?: string }) => {
      playDashboardNotificationSound();
      showToast(payload?.title || "New trip notification", "info");
    });
    dashboardNotificationsSocket.on("connect_error", (error) => {
      console.error("Dashboard socket connect_error:", error?.message ?? error);
    });
  },

  teardownRealtime: () => {
    if (!dashboardNotificationsSocket) return;
    dashboardNotificationsSocket.disconnect();
    dashboardNotificationsSocket = null;
    if (typeof window !== "undefined") {
      (window as any).__dashboardSocket = null;
    }
  },

  setActiveTab: (tab) => set({ activeTab: tab }),
}));

export default useDashboardNotificationsStore;
