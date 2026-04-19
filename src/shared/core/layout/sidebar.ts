import { Bell, ChartColumn, CircleCheckBig, Database, LayoutDashboard, MapPin, Percent, PenTool, Settings, Shield, Tag, Ticket, Truck, Users, type LucideIcon } from "lucide-react";

export type SidebarBadgeKey = "notifications" | "support";

export interface ISidebarItem {
    id: number;
    /** Translation key under the `sidebar` namespace */
    nameKey: string;
    icon: LucideIcon;
    to: string;
    badgeKey?: SidebarBadgeKey;
}

export const sidebarItems: ISidebarItem[] = [
    {
        id: 1,
        nameKey: "dashboard",
        icon: LayoutDashboard,
        to: "/",
    },
    {
        id: 2,
        nameKey: "analytics",
        icon: ChartColumn,
        to: "/analytics",
    },
    {
        id: 3,
        nameKey: "dataManagement",
        icon: Database,
        to: "/data-management",
    },
    {
        id: 4,
        nameKey: "usersManagement",
        icon: Users,
        to: "/users",
    },
    {
        id: 5,
        nameKey: "driversManagement",
        icon: Truck,
        to: "/drivers",
    },
    {
        id: 6,
        nameKey: "driversVerification",
        icon: CircleCheckBig,
        to: "/verification",
    },
    {
        id: 7,
        nameKey: "tripsManagement",
        icon: MapPin,
        to: "/trips",
    },
    {
        id: 8,
        nameKey: "appsNotifications",
        icon: Bell,
        to: "/notifications",
        badgeKey: "notifications",
    },
    {
        id: 9,
        nameKey: "commissionAndPricing",
        icon: Percent,
        to: "/commission-and-pricing",
    },
    {
        id: 10,
        nameKey: "voucherAndPromo",
        icon: Tag,
        to: "/voucher-and-promo",
    },
    {
        id: 11,
        nameKey: "supportTickets",
        icon: Ticket,
        to: "/support-tickets",
        badgeKey: "support",
    },
    {
        id: 12,
        nameKey: "cms",
        icon: PenTool,
        to: "/cms",
    },
    {
        id: 13,
        nameKey: "adminRolesPermissions",
        icon: Shield,
        to: "/roles-and-permissions",
    },
    {
        id: 14,
        nameKey: "adminSettings",
        icon: Settings,
        to: "/settings",
    },
];
