import type { IFcmNotificationPayload } from "./fcm-payload";
import { fetchSinceAndRefreshStores } from "./fcm-since-cursor";

export type FcmEventFilter = {
    categories?: string[];
    entity_types?: string[];
};

type Handler = (payload: IFcmNotificationPayload) => void;

const bus = new EventTarget();
const DEDUPE_MS = 30_000;
const recent = new Map<string, number>();

const dedupeKeyOf = (p: IFcmNotificationPayload): string => {
    if (p.notification_id) return `id:${p.notification_id}`;
    if (p.trace_id) return `tr:${p.trace_id}`;
    return `ev:${p.event_type ?? "?"}:${p.entity_type ?? "?"}:${p.entity_id ?? "?"}`;
};

const passesFilter = (p: IFcmNotificationPayload, f?: FcmEventFilter): boolean => {
    if (!f) return true;
    if (f.categories?.length) {
        const c = String(p.category ?? "").toUpperCase();
        if (!f.categories.map((x) => x.toUpperCase()).includes(c)) return false;
    }
    if (f.entity_types?.length) {
        const e = String(p.entity_type ?? "");
        if (!f.entity_types.includes(e)) return false;
    }
    return true;
};

export const fcmEventBus = {
    publishFromFcm(parsed: IFcmNotificationPayload) {
        const key = dedupeKeyOf(parsed);
        const now = Date.now();
        const prev = recent.get(key);
        if (prev !== undefined && now - prev < DEDUPE_MS) {
            return;
        }
        recent.set(key, now);
        if (recent.size > 500) {
            const cutoff = now - DEDUPE_MS;
            for (const [k, t] of recent) {
                if (t < cutoff) recent.delete(k);
            }
        }

        void fetchSinceAndRefreshStores();
        bus.dispatchEvent(new CustomEvent("fcm", { detail: parsed }));
    },

    subscribe(filter: FcmEventFilter | undefined, handler: Handler): () => void {
        const fn = (ev: Event) => {
            const ce = ev as CustomEvent<IFcmNotificationPayload>;
            if (!passesFilter(ce.detail, filter)) return;
            handler(ce.detail);
        };
        bus.addEventListener("fcm", fn as EventListener);
        return () => bus.removeEventListener("fcm", fn as EventListener);
    },
};
