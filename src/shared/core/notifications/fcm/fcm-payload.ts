/**
 * Parsed FCM `data` payload aligned with backend UnifiedNotificationPayload + `notification_id`.
 */
export interface IFcmNotificationPayload {
    version?: number;
    notification_id?: number;
    event_type?: string;
    category?: string;
    action?: string;
    entity_type?: string;
    entity_id?: string | number | null;
    actor_type?: string;
    actor_id?: number | null;
    source_service?: string;
    trace_id?: string;
    silent?: boolean;
    collapse_key?: string;
    expires_at?: string;
    title?: string;
    body?: string;
    meta?: Record<string, unknown>;
}

const parseBool = (v: string | undefined): boolean | undefined => {
    if (v === undefined) return undefined;
    if (v === "true" || v === "1") return true;
    if (v === "false" || v === "0") return false;
    return undefined;
};

const parseJsonMeta = (raw: string | undefined): Record<string, unknown> | undefined => {
    if (!raw) return undefined;
    try {
        const v = JSON.parse(raw) as unknown;
        return v && typeof v === "object" && !Array.isArray(v) ? (v as Record<string, unknown>) : undefined;
    } catch {
        return undefined;
    }
};

export const parseFcmDataPayload = (data: Record<string, string> | undefined): IFcmNotificationPayload => {
    if (!data) return {};
    const nid = Number(data.notification_id);
    const aid = data.actor_id !== undefined ? Number(data.actor_id) : undefined;
    return {
        version: data.version !== undefined ? Number(data.version) : undefined,
        notification_id: Number.isFinite(nid) && nid > 0 ? nid : undefined,
        event_type: data.event_type,
        category: data.category,
        action: data.action,
        entity_type: data.entity_type,
        entity_id: data.entity_id !== undefined ? (Number.isNaN(Number(data.entity_id)) ? data.entity_id : Number(data.entity_id)) : undefined,
        actor_type: data.actor_type,
        actor_id: aid !== undefined && Number.isFinite(aid) ? aid : null,
        source_service: data.source_service,
        trace_id: data.trace_id,
        silent: parseBool(data.silent),
        collapse_key: data.collapse_key,
        expires_at: data.expires_at,
        title: data.title,
        body: data.body,
        meta: parseJsonMeta(data.meta),
    };
};
