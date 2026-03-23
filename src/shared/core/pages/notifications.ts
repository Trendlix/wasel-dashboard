export type TNotificationAudience = "all" | "users" | "drivers";

export interface IRecentNotification {
    id: number;
    title: string;
    sentTo: string;
    sentAt: string;
}

export const recentNotifications: IRecentNotification[] = [
    { id: 1, title: "New Feature: Express Delivery", sentTo: "All Users", sentAt: "2 hours ago" },
    { id: 2, title: "System Maintenance Alert", sentTo: "All Users & Drivers", sentAt: "1 day ago" },
    { id: 3, title: "Driver Earnings Update", sentTo: "Drivers", sentAt: "2 days ago" },
    { id: 4, title: "Holiday Bonus Announcement", sentTo: "All Drivers", sentAt: "3 days ago" },
    { id: 5, title: "App Update Available", sentTo: "All Users", sentAt: "5 days ago" },
];

export const audienceOptions: { value: TNotificationAudience; label: string; icon: string }[] = [
    { value: "all", label: "All", icon: "users-round" },
    { value: "users", label: "Users", icon: "users" },
    { value: "drivers", label: "Drivers", icon: "truck" },
];