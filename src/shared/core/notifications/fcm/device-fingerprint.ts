const DEVICE_KEY = "wasel_dashboard_device_id";

export const getOrCreateDeviceLabel = (): string => {
    if (typeof window === "undefined") return "server";
    try {
        let id = window.localStorage.getItem(DEVICE_KEY);
        if (!id) {
            id =
                typeof crypto !== "undefined" && "randomUUID" in crypto
                    ? crypto.randomUUID()
                    : `dev_${Date.now()}_${Math.random().toString(16).slice(2)}`;
            window.localStorage.setItem(DEVICE_KEY, id);
        }
        const ua = navigator.userAgent || "unknown";
        return `${ua.slice(0, 80)}|${id}`;
    } catch {
        return `fallback_${Date.now()}`;
    }
};
