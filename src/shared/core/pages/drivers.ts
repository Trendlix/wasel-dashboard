import type { IAnalyticsCard } from "../../components/common/AnalyticsCard";
import { Clock, Truck } from "lucide-react";

export type TDriverStatus =
    | "pending"
    | "approved"
    | "suspended"
    | "blocked"
    | "rejected"
    | "deleted";

export const driverStatusStyles: Record<TDriverStatus, { bg: string; text: string; label: string }> = {
    pending: { bg: "bg-main-mustardGold/10", text: "text-main-mustardGold", label: "Pending" },
    approved: { bg: "bg-main-vividMint/10", text: "text-main-vividMint", label: "Approved" },
    suspended: { bg: "bg-main-ladyBlue/10", text: "text-main-ladyBlue", label: "Suspended" },
    blocked: { bg: "bg-main-remove/10", text: "text-main-remove", label: "Blocked" },
    rejected: { bg: "bg-main-sharkGray/10", text: "text-main-sharkGray", label: "Rejected" },
    deleted: { bg: "bg-main-mirage/10", text: "text-main-mirage", label: "Deleted" },
};

export const driversAnalyticsConfig: Omit<IAnalyticsCard, "value">[] = [
    { id: 1, title: "Total Drivers", icon: Truck, classname: "bg-main-white border border-main-whiteMarble" },
    { id: 2, title: "Approved Drivers", icon: Truck, classname: "bg-main-white border border-main-whiteMarble" },
    { id: 3, title: "Pending Drivers", icon: Clock, classname: "bg-main-white border border-main-whiteMarble" },
];
