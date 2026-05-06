import axiosNormalApiClient from "@/shared/utils/axios";

const CURSOR_KEY = "wasel_dashboard_notifications_cursor";

export type SinceCursor = { since_id: number | null; since_at: string | null };

export const getSinceCursor = (): SinceCursor | null => {
    if (typeof window === "undefined") return null;
    try {
        const raw = window.localStorage.getItem(CURSOR_KEY);
        if (!raw) return null;
        const v = JSON.parse(raw) as SinceCursor;
        return v;
    } catch {
        return null;
    }
};

export const setSinceCursor = (c: SinceCursor | null) => {
    if (typeof window === "undefined") return;
    if (!c) {
        window.localStorage.removeItem(CURSOR_KEY);
        return;
    }
    window.localStorage.setItem(CURSOR_KEY, JSON.stringify(c));
};

/**
 * Refetches dashboard inbox state from the DB after FCM / refresh hints.
 * Also refreshes support surfaces when relevant categories appear in the delta.
 */
export const fetchSinceAndRefreshStores = async (): Promise<void> => {
    const cursor = getSinceCursor();
    const params = new URLSearchParams();
    if (cursor?.since_id && cursor.since_id > 0) params.set("since_id", String(cursor.since_id));
    if (cursor?.since_at) params.set("since_at", cursor.since_at);

    const res = await axiosNormalApiClient.get(`/dashboard/notifications/since?${params.toString()}`);
    const data = res.data?.data;
    const nextCursor = data?.cursor as SinceCursor | undefined;
    if (nextCursor) {
        setSinceCursor({
            since_id: nextCursor.since_id ?? null,
            since_at: nextCursor.since_at ? String(nextCursor.since_at) : null,
        });
    }

    const items = (data?.items ?? []) as Array<{ category?: string | null }>;
    const needsSupport = items.some((it) => {
        const c = String(it?.category ?? "").toUpperCase();
        return c === "SUPPORT" || c === "CHAT";
    });

    const [{ default: useDashboardNotificationsStore }, { default: useTicketStore }] = await Promise.all([
        import("@/shared/hooks/store/useDashboardNotificationsStore"),
        import("@/shared/hooks/store/useTicketStore"),
    ]);

    await Promise.all([
        useDashboardNotificationsStore.getState().fetchNotifications(),
        useDashboardNotificationsStore.getState().fetchNotificationsCount(),
    ]);

    if (needsSupport) {
        const ts = useTicketStore.getState();
        await Promise.all([ts.fetchStats(), ts.fetchTickets(), ts.fetchSupportNotifications(1)]);
    }
};
