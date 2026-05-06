import { isFcmEnabled, setFcmRuntimeReady } from "./fcm-env";
import { getFirebaseApp } from "./firebase-config";
import { requestPermissionAndGetToken, registerTokenWithBackend } from "./fcm-token-manager";
import { startFcmForegroundListener } from "./fcm-foreground-listener";
import { connectChatPresenceGateway, disconnectChatPresenceGateway, onRefreshHint } from "./chat-presence-gateway";
import { fetchSinceAndRefreshStores } from "./fcm-since-cursor";
import { startFcmFallbackPoller, stopFcmFallbackPoller } from "./fcm-fallback-poller";
import { parseFcmDataPayload } from "./fcm-payload";
import { fcmEventBus } from "./fcm-event-bus";
import fcmServiceWorkerUrl from "@/shared/utils/firebase-messaging-sw.js?url";

let refreshTokenTimer: number | null = null;

/**
 * Registers the Firebase service worker from src asset URL,
 * obtains an FCM token, registers it with the backend, and wires foreground messaging.
 */
export const initializeFcm = async (adminId: number): Promise<void> => {
    if (!isFcmEnabled() || typeof window === "undefined") return;
    setFcmRuntimeReady(false);

    // Touch Firebase app early so misconfiguration fails loudly in dev.
    getFirebaseApp();

    const swQuery = new URLSearchParams({
        apiKey: import.meta.env.VITE_FCM_API_KEY ?? "",
        authDomain: import.meta.env.VITE_FCM_AUTH_DOMAIN ?? "",
        projectId: import.meta.env.VITE_FCM_PROJECT_ID ?? "",
        storageBucket: import.meta.env.VITE_FCM_STORAGE_BUCKET ?? "",
        messagingSenderId: import.meta.env.VITE_FCM_MESSAGING_SENDER_ID ?? "",
        appId: import.meta.env.VITE_FCM_APP_ID ?? "",
    });

    let registration: ServiceWorkerRegistration;
    try {
        const swUrl = new URL(fcmServiceWorkerUrl, window.location.origin);
        swUrl.search = swQuery.toString();
        const swScope = swUrl.pathname.slice(0, swUrl.pathname.lastIndexOf("/") + 1) || "/";
        registration = await navigator.serviceWorker.register(swUrl.toString(), {
            scope: swScope,
        });
    } catch (error) {
        console.warn("[fcm] failed to register service worker", error);
        return;
    }

    const swMessageHandler = (ev: MessageEvent) => {
        if (ev.data?.type === "FCM_BACKGROUND" && ev.data?.data) {
            fcmEventBus.publishFromFcm(parseFcmDataPayload(ev.data.data as Record<string, string>));
        }
    };
    navigator.serviceWorker.addEventListener("message", swMessageHandler);

    const vapid = import.meta.env.VITE_FCM_VAPID_KEY;
    if (!vapid) {
        console.warn("[fcm] VITE_FCM_VAPID_KEY missing; skipping token registration.");
    } else {
        try {
            const token = await requestPermissionAndGetToken(registration, vapid);
            if (token) {
                await registerTokenWithBackend(token);
            } else {
                console.warn("[fcm] no token received (permission may be denied).");
            }
        } catch (error) {
            console.warn("[fcm] token bootstrap failed", error);
        }
    }

    startFcmForegroundListener();
    connectChatPresenceGateway(adminId);
    onRefreshHint(() => {
        void fetchSinceAndRefreshStores();
    });
    startFcmFallbackPoller();
    void fetchSinceAndRefreshStores();
    setFcmRuntimeReady(true);

    if (refreshTokenTimer !== null) window.clearInterval(refreshTokenTimer);
    refreshTokenTimer = window.setInterval(async () => {
        const vapidKey = import.meta.env.VITE_FCM_VAPID_KEY;
        if (!vapidKey) return;
        try {
            const token = await requestPermissionAndGetToken(registration, vapidKey);
            if (token) await registerTokenWithBackend(token);
        } catch (error) {
            console.warn("[fcm] periodic token refresh failed", error);
        }
    }, 24 * 60 * 60 * 1000);
};

export const teardownFcm = () => {
    if (refreshTokenTimer !== null) {
        window.clearInterval(refreshTokenTimer);
        refreshTokenTimer = null;
    }
    stopFcmFallbackPoller();
    disconnectChatPresenceGateway();
    setFcmRuntimeReady(false);
};
