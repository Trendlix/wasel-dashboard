import { getDashboardApiOrigin } from "./fcm-env";

const jsonBody = (obj: object) =>
    new Blob([JSON.stringify(obj)], { type: "application/json;charset=UTF-8" });

export const reportDelivered = (notificationId: number, deviceToken?: string) => {
    const url = `${getDashboardApiOrigin()}/dashboard/notifications/${notificationId}/delivered`;
    const body = jsonBody({ device_token: deviceToken });
    if (typeof navigator !== "undefined" && navigator.sendBeacon) {
        navigator.sendBeacon(url, body);
        return;
    }
    void fetch(url, { method: "POST", credentials: "include", body, keepalive: true });
};

export const reportClicked = (notificationId: number, deviceToken?: string) => {
    const url = `${getDashboardApiOrigin()}/dashboard/notifications/${notificationId}/clicked`;
    const body = jsonBody({ device_token: deviceToken });
    if (typeof navigator !== "undefined" && navigator.sendBeacon) {
        navigator.sendBeacon(url, body);
        return;
    }
    void fetch(url, { method: "POST", credentials: "include", body, keepalive: true });
};