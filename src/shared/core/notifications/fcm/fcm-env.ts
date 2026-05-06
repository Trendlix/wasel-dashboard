/** True when dashboard should use Web Push + since-cursor instead of legacy notification sockets. */
export const isFcmEnabled = (): boolean => {
    const v = import.meta.env.VITE_FCM_ENABLED;
    return v === "true" || v === "1";
};

let fcmRuntimeReady = false;

export const setFcmRuntimeReady = (ready: boolean) => {
    fcmRuntimeReady = ready;
};

export const isFcmRuntimeReady = (): boolean => fcmRuntimeReady;

export const shouldUseFcmRealtime = (): boolean => isFcmEnabled() && isFcmRuntimeReady();

export const getDashboardApiOrigin = (): string => {
    const base = import.meta.env.VITE_API_BASE_URL || "";
    if (!base) return window.location.origin;
    try {
        return new URL(base, window.location.origin).origin;
    } catch {
        return window.location.origin;
    }
};
