export interface IRole {
    id: number;
    name: string;
    description: string;
    users: number;
    color: string;
}

export interface INotificationPreference {
    id: string;
    label: string;
    enabled: boolean;
}

export const roles: IRole[] = [
    { id: 1, name: "Admin", description: "Full Access", users: 3, color: "bg-main-primary" },
    { id: 2, name: "Support", description: "View & Edit Users/Drivers", users: 8, color: "bg-main-vividMint" },
    { id: 3, name: "Finance", description: "View & Manage Wallet", users: 2, color: "bg-main-mustardGold" },
];

export const notificationPreferences: INotificationPreference[] = [
    { id: "new_users", label: "Email notifications for new users", enabled: true },
    { id: "new_drivers", label: "Email notifications for new drivers", enabled: true },
    { id: "pending_verifications", label: "Email notifications for pending verifications", enabled: true },
    { id: "daily_revenue", label: "Daily revenue reports", enabled: false },
    { id: "weekly_analytics", label: "Weekly analytics summary", enabled: true },
];