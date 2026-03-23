import { DollarSign, TrendingUp, Truck, Users } from "lucide-react";
import type { IAnalyticsCard } from "../../components/common/AnalyticsCard";


export const IDashboardAnalytics: IAnalyticsCard[] = [
    {
        id: 1,
        title: "Total Revenue",
        value: "EGP 328K",
        description: "↑ 12.5% from last month",
        icon: DollarSign,
        classname: "bg-main-vividMint"
    },
    {
        id: 2,
        title: "Total Trips",
        value: "9.120",
        description: "↑ 8.2% from last month",
        icon: TrendingUp,
        classname: "bg-main-primary"
    },
    {
        id: 3,
        title: "Active Users",
        value: "3.247",
        description: "↑↑ 3.1% from last month",
        icon: Users,
        classname: "bg-main-ladyBlue"
    },
    {
        id: 4,
        title: "Active Drivers",
        value: "892",
        description: "↑ 5.4% from last month",
        icon: Truck,
        classname: "bg-main-mustardGold"
    },
]


export interface IPendingVerification {
    id: number,
    name: string;
    role: string;
    createdAt: Date;
}

export const pendingVerifications: IPendingVerification[] = [
    {
        id: 1,
        name: "John Doe",
        role: "Driver",
        createdAt: new Date(),
    },
    {
        id: 2,
        name: "John Doe",
        role: "Driver",
        createdAt: new Date(),
    },
    {
        id: 3,
        name: "John Doe",
        role: "Driver",
        createdAt: new Date(),
    }
]

export type TActivityTag = "trip" | "user" | "driver" | "payment" | "verification" | "storage";

export interface IRecentActivity {
    id: number;
    title: string;
    description: string;
    tag: TActivityTag;
    time: string;
}

export const recentActivities: IRecentActivity[] = [
    {
        id: 1,
        title: "New Trip Started",
        description: "Driver Ahmed started a trip to Cairo.",
        tag: "trip",
        time: "2 hours ago",
    },
    {
        id: 2,
        title: "New User Registered",
        description: "User Mohamed Ali joined the platform.",
        tag: "user",
        time: "4 hours ago",
    },
    {
        id: 3,
        title: "Driver Verified",
        description: "Driver Khaled Hassan passed verification.",
        tag: "driver",
        time: "5 hours ago",
    },
    {
        id: 4,
        title: "Payment Received",
        description: "Payment of $120 received from Omar Salem.",
        tag: "payment",
        time: "6 hours ago",
    },
    {
        id: 5,
        title: "Verification Pending",
        description: "Storage owner Mona Adel submitted documents.",
        tag: "verification",
        time: "8 hours ago",
    },
    {
        id: 6,
        title: "Storage Added",
        description: "New storage unit added in Alexandria.",
        tag: "storage",
        time: "10 hours ago",
    },
    {
        id: 7,
        title: "Trip Completed",
        description: "Trip #1042 completed successfully.",
        tag: "trip",
        time: "12 hours ago",
    },
    {
        id: 8,
        title: "Payment Failed",
        description: "Payment of $80 failed for user Sara Hassan.",
        tag: "payment",
        time: "1 day ago",
    },
];

export const tagColors: Record<TActivityTag, { bg: string; text: string }> = {
    trip: { bg: "bg-main-primary/10", text: "text-main-primary" },
    user: { bg: "bg-main-ladyBlue/10", text: "text-main-ladyBlue" },
    driver: { bg: "bg-main-vividMint/10", text: "text-main-vividMint" },
    payment: { bg: "bg-main-mustardGold/10", text: "text-main-mustardGold" },
    verification: { bg: "bg-main-secondary/10", text: "text-main-secondary" },
    storage: { bg: "bg-main-gunmetalBlue/10", text: "text-main-gunmetalBlue" },
};