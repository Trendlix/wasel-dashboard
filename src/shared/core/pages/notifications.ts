export type TNotificationAudience = "all" | "users" | "drivers";
export type TNotificationsFilterTab = "user" | "driver" | "trip";
export type TNotificationManagementTab = "driver-admin" | "user-admin" | "trip-admin" | "offers-updates" | "driver-offers-updates";
export type TNotificationDeliveryStatus = "sent" | "scheduled" | "failed";
export type TAdminDriverNotificationType = "message" | "error" | "issue" | "account_actions_alert" | "warning" | "success" | "any";
export type TDriverNotificationBusinessCategory =
    | "account_deleted"
    | "account_suspended"
    | "account_approved"
    | "account_rejected"
    | "document_expiry"
    | "other";

export const notificationsFilterTabs: { value: TNotificationsFilterTab; label: string }[] = [
    { value: "user", label: "Users" },
    { value: "driver", label: "Drivers" },
    { value: "trip", label: "Trips" },
];

export const notificationManagementTabs: { value: TNotificationManagementTab; label: string }[] = [
    { value: "driver-admin", label: "Driver" },
    { value: "user-admin", label: "User" },
    { value: "trip-admin", label: "Trip" },
    { value: "offers-updates", label: "Offers & Updates" },
];

export const notificationDeliveryStatuses: { value: TNotificationDeliveryStatus | "all"; label: string }[] = [
    { value: "all", label: "All statuses" },
    { value: "sent", label: "Sent" },
    { value: "scheduled", label: "Scheduled" },
    { value: "failed", label: "Failed" },
];

export const adminDriverNotificationTypeOptions: TAdminDriverNotificationType[] = [
    "message",
    "error",
    "issue",
    "account_actions_alert",
    "warning",
    "success",
    "any",
];

export const driverNotificationBusinessCategoryOptions: TDriverNotificationBusinessCategory[] = [
    "account_deleted",
    "account_suspended",
    "account_approved",
    "account_rejected",
    "document_expiry",
    "other",
];

export const audienceOptions: { value: TNotificationAudience; label: string; icon: string }[] = [
    { value: "all", label: "All", icon: "users-round" },
    { value: "users", label: "Users", icon: "users" },
    { value: "drivers", label: "Drivers", icon: "truck" },
];
