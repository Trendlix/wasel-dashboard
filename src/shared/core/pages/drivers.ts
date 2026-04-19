import type { IAnalyticsCard } from "../../components/common/AnalyticsCard";
import { Clock, Truck, type LucideIcon } from "lucide-react";

export type TDriverStatus =
    | "pending"
    | "approved"
    | "suspended"
    | "blocked"
    | "rejected"
    | "deleted";

export const driverStatusStyles: Record<TDriverStatus, { bg: string; text: string }> = {
    pending: { bg: "bg-main-mustardGold/10", text: "text-main-mustardGold" },
    approved: { bg: "bg-main-vividMint/10", text: "text-main-vividMint" },
    suspended: { bg: "bg-main-ladyBlue/10", text: "text-main-ladyBlue" },
    blocked: { bg: "bg-main-remove/10", text: "text-main-remove" },
    rejected: { bg: "bg-main-sharkGray/10", text: "text-main-sharkGray" },
    deleted: { bg: "bg-main-mirage/10", text: "text-main-mirage" },
};

export const driversAnalyticsConfig: Array<
    Pick<IAnalyticsCard, "id" | "classname"> & { icon: LucideIcon; titleKey: "totalDrivers" | "approvedDrivers" | "pendingDrivers" }
> = [
    { id: 1, titleKey: "totalDrivers", icon: Truck, classname: "bg-main-white border border-main-whiteMarble" },
    { id: 2, titleKey: "approvedDrivers", icon: Truck, classname: "bg-main-white border border-main-whiteMarble" },
    { id: 3, titleKey: "pendingDrivers", icon: Clock, classname: "bg-main-white border border-main-whiteMarble" },
];
