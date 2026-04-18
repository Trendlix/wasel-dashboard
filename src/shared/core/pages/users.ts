import { Users } from "lucide-react";
import type { IAnalyticsCard } from "../../components/common/AnalyticsCard";

export const usersAnalyticsConfig: Omit<IAnalyticsCard, "value">[] = [
    { id: 1, title: "Total Users",   icon: Users, classname: "bg-main-white border border-main-whiteMarble" },
    { id: 2, title: "Active Users",  icon: Users, classname: "bg-main-white border border-main-whiteMarble" },
    { id: 3, title: "Blocked Users", icon: Users, classname: "bg-main-white border border-main-whiteMarble" },
];

export type TUserStatus = "active" | "inactive" | "blocked" | "deleted";

export const statusStyles: Record<TUserStatus, { bg: string; text: string; label: string }> = {
    active:   { bg: "bg-main-vividMint/10",  text: "text-main-vividMint",  label: "Active"   },
    inactive: { bg: "bg-main-sharkGray/10",  text: "text-main-sharkGray",  label: "Inactive" },
    blocked:  { bg: "bg-main-remove/10",     text: "text-main-remove",     label: "Blocked"  },
    deleted:  { bg: "bg-main-mirage/10",     text: "text-main-mirage",     label: "Deleted"  },
};