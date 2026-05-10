export interface IUnifiedDashboardNotificationEvent {
  id?: number;
  event_key?: string;
  title?: string;
  body?: string;
  payload?: Record<string, unknown> | null;
  created_at?: string;
}

export type UnifiedDashboardNotificationBucket =
  | "offer"
  | "update"
  | "support"
  | "trip"
  | "general";

/** Toast / banner fallback when title/body are empty (socket + FCM unified events). */
export const unifiedDashboardBucketToastLabel: Record<
  UnifiedDashboardNotificationBucket,
  string
> = {
  offer: "Offer update",
  update: "System update",
  support: "Support update",
  trip: "Trip cancelled",
  general: "New notification",
};

const offerEventKeys = new Set<string>([
  "offer.campaign.by_admin",
  "driver.offer.campaign.by_admin",
  "offer.quoted.by_driver",
  "offer.accepted.by_user",
  "offer.rejected.by_user",
  "request.created.fanout_to_drivers",
  "request.rejected.by_driver",
]);

const updateEventKeys = new Set<string>([
  "update.campaign.by_admin",
  "driver.update.campaign.by_admin",
  "driver.verification.approved",
  "driver.verification.rejected",
  "user.status.changed",
  "driver.status.changed",
]);

const supportEventKeys = new Set<string>([
  "ticket.created",
  "ticket.reply.by_admin",
  "chat.message.new",
]);

/** Legacy taxonomy-derived wire type before orchestrator set explicit `event_type`. */
const tripAdminEventKeys = new Set<string>([
  "admin.trip.cancelled",
  "updates.trip.cancelled",
]);

export const mapUnifiedEventToDashboardBucket = (
  eventKey: string | undefined,
): UnifiedDashboardNotificationBucket => {
  if (!eventKey) return "general";
  if (offerEventKeys.has(eventKey)) return "offer";
  if (updateEventKeys.has(eventKey)) return "update";
  if (supportEventKeys.has(eventKey)) return "support";
  if (tripAdminEventKeys.has(eventKey)) return "trip";
  return "general";
};

export const getUnifiedEventDisplayTitle = (
  payload: IUnifiedDashboardNotificationEvent,
): string => {
  if (payload.title && payload.title.trim()) return payload.title;
  if (payload.body && payload.body.trim()) return payload.body;
  return "New notification";
};

export const buildUnifiedDashboardDedupeKey = (
  payload: IUnifiedDashboardNotificationEvent,
): string => {
  if (payload.id) return `id:${payload.id}`;
  const eventKey = payload.event_key ?? "unknown";
  const createdAt = payload.created_at ?? "unknown";
  const entityId = payload.payload?.entity_id ?? payload.payload?.ticket_id ?? "na";
  return `${eventKey}:${createdAt}:${entityId}`;
};

