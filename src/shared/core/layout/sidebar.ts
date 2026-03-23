import { Bell, ChartColumn, CircleCheckBig, LayoutDashboard, MapPin, Settings, Truck, Users, Wallet, Warehouse, type LucideIcon } from "lucide-react";

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
    {
        id: 4,
        name: "storage owners",
        icon: Warehouse,
        to: "/storage-owners"
    },
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
    {
        id: 7,
        name: "wallet/finance",
        icon: Wallet,
        to: "/wallet-and-finance"
    },
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
    }
]