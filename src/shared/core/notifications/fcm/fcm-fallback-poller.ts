import { fetchSinceAndRefreshStores } from "./fcm-since-cursor";

let intervalId: number | null = null;

export const startFcmFallbackPoller = () => {
    if (typeof window === "undefined") return;
    const tick = () => {
        if (document.visibilityState !== "visible") return;
        void fetchSinceAndRefreshStores();
    };
    document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "visible") void fetchSinceAndRefreshStores();
    });
    intervalId = window.setInterval(tick, 30_000);
};

export const stopFcmFallbackPoller = () => {
    if (intervalId !== null) {
        window.clearInterval(intervalId);
        intervalId = null;
    }
};
