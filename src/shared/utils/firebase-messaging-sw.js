/* eslint-disable no-undef */
/**
 * Firebase Cloud Messaging service worker (compat API).
 * Config comes from URL query params generated from Vite env in app bootstrap.
 */
importScripts("https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.14.1/firebase-messaging-compat.js");

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", () => self.clients.claim());

const params = new URL(self.location.href).searchParams;
const firebaseConfig = {
    apiKey: params.get("apiKey") || "",
    authDomain: params.get("authDomain") || "",
    projectId: params.get("projectId") || "",
    storageBucket: params.get("storageBucket") || "",
    messagingSenderId: params.get("messagingSenderId") || "",
    appId: params.get("appId") || "",
};

if (firebaseConfig.apiKey && firebaseConfig.projectId) {
    firebase.initializeApp(firebaseConfig);
    const messaging = firebase.messaging();
    messaging.onBackgroundMessage((payload) => {
        const data = payload.data || {};
        const title = payload.notification?.title || data.title || "Wasel";
        const body = payload.notification?.body || data.body || "";
        self.registration.showNotification(title, { body, data, tag: data.collapse_key });
        const id = data.notification_id;
        if (id) {
            const origin = self.location.origin;
            fetch(`${origin}/dashboard/notifications/${id}/delivered`, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: "{}",
                keepalive: true,
            }).catch(() => {});
        }
        self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clients) => {
            clients.forEach((client) => {
                client.postMessage({ type: "FCM_BACKGROUND", data });
            });
        });
    });
}

self.addEventListener("notificationclick", (event) => {
    event.notification.close();
    const data = event.notification.data || {};
    const id = data.notification_id;
    if (id) {
        const origin = self.location.origin;
        fetch(`${origin}/dashboard/notifications/${id}/clicked`, {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: "{}",
            keepalive: true,
        }).catch(() => {});
    }
    event.waitUntil(
        self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
            if (clientList.length > 0) {
                clientList[0].focus();
            }
        }),
    );
});
