import { Bell, ChartColumn, CircleCheckBig, Database, LayoutDashboard, MapPin, Percent, PenTool, Settings, Shield, Tag, Ticket, Truck, Users, type LucideIcon } from "lucide-react";

export interface ISidebarItem {
    id: number;
    name: string;
    icon: LucideIcon;
    to: string;
}

export const sidebarItems: ISidebarItem[] = [
    {
        id: 1,
        name: "dashboard",
        icon: LayoutDashboard,
        to: "/"
    },
    {
        id: 2,
        name: "users",
        icon: Users,
        to: "/users"
    },
    {
        id: 3,
        name: "drivers",
        icon: Truck,
        to: "/drivers"
    },
    /*    {
            id: 4,
            name: "storage owners",
            icon: Warehouse,
            to: "/storage-owners"
        },*/
    {
        id: 5,
        name: "Verfication",
        icon: CircleCheckBig,
        to: "/verification"
    },
    {
        id: 6,
        name: "trips",
        icon: MapPin,
        to: "/trips"
    },
    // {
    //     id: 7,
    //     name: "wallet/finance",
    //     icon: Wallet,
    //     to: "/wallet-and-finance"
    // },
    {
        id: 8,
        name: "analytics",
        icon: ChartColumn,
        to: "/analytics"
    },
    {
        id: 9,
        name: "notifications",
        icon: Bell,
        to: "/notifications"
    },
    {
        id: 10,
        name: "settings",
        icon: Settings,
        to: "/settings"
    },
    {
        id: 11,
        name: "cms",
        icon: PenTool,
        to: "/cms"
    },
    {
        id: 12,
        name: "roles & permissions",
        icon: Shield,
        to: "/roles-and-permissions"
    },
    {
        id: 13,
        name: "commission & pricing",
        icon: Percent,
        to: "/commission-and-pricing"
    },
    {
        id: 14,
        name: "voucher & promo",
        icon: Tag,
        to: "/voucher-and-promo"
    },
    {
        id: 15,
        name: "Data Management",
        icon: Database,
        to: "/data-management"
    },
    {
        id: 16,
        name: "Support Tickets",
        icon: Ticket,
        to: "/support-tickets"
    },
]