import { DollarSign, TrendingUp, Truck, Users } from "lucide-react";
import type { IAnalyticsCard } from "../../components/common/AnalyticsCard";
import type { LucideIcon } from "lucide-react";

export type TDashboardMetricKey =
    | "totalRevenue"
    | "totalTrips"
    | "activeUsers"
    | "activeDrivers";

export const IDashboardAnalytics: Array<
    Pick<IAnalyticsCard, "id" | "value" | "classname"> & { metricKey: TDashboardMetricKey; icon: LucideIcon }
> = [
    {
        id: 1,
        metricKey: "totalRevenue",
        value: "EGP 328K",
        icon: DollarSign,
        classname: "bg-main-vividMint",
    },
    {
        id: 2,
        metricKey: "totalTrips",
        value: "9.120",
        icon: TrendingUp,
        classname: "bg-main-primary",
    },
    {
        id: 3,
        metricKey: "activeUsers",
        value: "3.247",
        icon: Users,
        classname: "bg-main-ladyBlue",
    },
    {
        id: 4,
        metricKey: "activeDrivers",
        value: "892",
        icon: Truck,
        classname: "bg-main-mustardGold",
    },
];

export type TPendingRoleKey = "driver";

export interface IPendingVerification {
    id: number;
    name: string;
    roleKey: TPendingRoleKey;
    createdAt: Date;
}

export const pendingVerifications: IPendingVerification[] = [
    { id: 1, name: "John Doe", roleKey: "driver", createdAt: new Date() },
    { id: 2, name: "John Doe", roleKey: "driver", createdAt: new Date() },
    { id: 3, name: "John Doe", roleKey: "driver", createdAt: new Date() },
];

export type TActivityTag = "trip" | "user" | "driver" | "payment" | "verification" | "storage";

export type TActivityTitleKey =
    | "tripStarted"
    | "userRegistered"
    | "driverVerified"
    | "paymentReceived"
    | "verificationPending"
    | "storageAdded"
    | "tripCompleted"
    | "paymentFailed";

export interface IRecentActivity {
    id: number;
    titleKey: TActivityTitleKey;
    tag: TActivityTag;
    timeKey: string;
}

export const recentActivities: IRecentActivity[] = [
    { id: 1, titleKey: "tripStarted", tag: "trip", timeKey: "hours2" },
    { id: 2, titleKey: "userRegistered", tag: "user", timeKey: "hours4" },
    { id: 3, titleKey: "driverVerified", tag: "driver", timeKey: "hours5" },
    { id: 4, titleKey: "paymentReceived", tag: "payment", timeKey: "hours6" },
    { id: 5, titleKey: "verificationPending", tag: "verification", timeKey: "hours8" },
    { id: 6, titleKey: "storageAdded", tag: "storage", timeKey: "hours10" },
    { id: 7, titleKey: "tripCompleted", tag: "trip", timeKey: "hours12" },
    { id: 8, titleKey: "paymentFailed", tag: "payment", timeKey: "day1" },
];

export const tagColors: Record<TActivityTag, { bg: string; text: string }> = {
    trip: { bg: "bg-main-primary/10", text: "text-main-primary" },
    user: { bg: "bg-main-ladyBlue/10", text: "text-main-ladyBlue" },
    driver: { bg: "bg-main-vividMint/10", text: "text-main-vividMint" },
    payment: { bg: "bg-main-mustardGold/10", text: "text-main-mustardGold" },
    verification: { bg: "bg-main-secondary/10", text: "text-main-secondary" },
    storage: { bg: "bg-main-gunmetalBlue/10", text: "text-main-gunmetalBlue" },
};
