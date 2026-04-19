import { Users, type LucideIcon } from "lucide-react";
import type { IAnalyticsCard } from "../../components/common/AnalyticsCard";

export const usersAnalyticsConfig: Array<
    Pick<IAnalyticsCard, "id" | "classname"> & { icon: LucideIcon; titleKey: "totalUsers" | "activeUsers" | "blockedUsers" }
> = [
    { id: 1, titleKey: "totalUsers", icon: Users, classname: "bg-main-white border border-main-whiteMarble" },
    { id: 2, titleKey: "activeUsers", icon: Users, classname: "bg-main-white border border-main-whiteMarble" },
    { id: 3, titleKey: "blockedUsers", icon: Users, classname: "bg-main-white border border-main-whiteMarble" },
];

export type TUserStatus = "active" | "inactive" | "blocked" | "deleted";

export const statusStyles: Record<TUserStatus, { bg: string; text: string }> = {
    active: { bg: "bg-main-vividMint/10", text: "text-main-vividMint" },
    inactive: { bg: "bg-main-sharkGray/10", text: "text-main-sharkGray" },
    blocked: { bg: "bg-main-remove/10", text: "text-main-remove" },
    deleted: { bg: "bg-main-mirage/10", text: "text-main-mirage" },
};