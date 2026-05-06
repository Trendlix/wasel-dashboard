import { getMessaging, getToken, isSupported, type Messaging } from "firebase/messaging";
import axiosNormalApiClient from "@/shared/utils/axios";
import { getFirebaseApp } from "./firebase-config";
import { getOrCreateDeviceLabel } from "./device-fingerprint";

const SESSION_TOKEN_KEY = "wasel_dashboard_fcm_token_registered";

let lastRegisteredFcmToken: string | null = null;

export const getLastRegisteredFcmToken = () => lastRegisteredFcmToken;

export const requestPermissionAndGetToken = async (
    registration: ServiceWorkerRegistration | undefined,
    vapidKey: string,
): Promise<string | null> => {
    if (typeof window === "undefined") return null;
    const supported = await isSupported().catch(() => false);
    if (!supported) return null;
    const perm = await Notification.requestPermission();
    if (perm !== "granted") return null;
    const app = getFirebaseApp();
    const messaging: Messaging = getMessaging(app);
    return getToken(messaging, {
        vapidKey,
        serviceWorkerRegistration: registration,
    });
};

export const registerTokenWithBackend = async (token: string): Promise<void> => {
    const last = sessionStorage.getItem(SESSION_TOKEN_KEY);
    lastRegisteredFcmToken = token;

    if (last === token) {
        try {
            const devices = await axiosNormalApiClient.get("/admin/device-token/my-devices");
            const rows = Array.isArray(devices.data) ? devices.data : [];
            const existsOnBackend = rows.some((row) => row?.token === token);
            if (existsOnBackend) return;
        } catch {
            // If the verification endpoint fails, continue and attempt registration.
        }
    }

    await axiosNormalApiClient.post("/admin/device-token", {
        device_token: token,
        device_label: getOrCreateDeviceLabel(),
        platform: "web",
    });
    sessionStorage.setItem(SESSION_TOKEN_KEY, token);
};
