import { getMessaging, onMessage, type Messaging } from "firebase/messaging";
import { getFirebaseApp } from "./firebase-config";
import { parseFcmDataPayload } from "./fcm-payload";
import { fcmEventBus } from "./fcm-event-bus";
import { reportDelivered } from "./fcm-delivery-receipts";
import { getLastRegisteredFcmToken } from "./fcm-token-manager";

let started = false;

export const startFcmForegroundListener = () => {
    if (typeof window === "undefined" || started) return;
    started = true;
    const messaging: Messaging = getMessaging(getFirebaseApp());
    onMessage(messaging, (msg) => {
        const parsed = parseFcmDataPayload(msg.data as Record<string, string> | undefined);
        if (parsed.notification_id) {
            reportDelivered(parsed.notification_id, getLastRegisteredFcmToken() ?? undefined);
        }
        fcmEventBus.publishFromFcm(parsed);
    });
};
