import { Shield, Users, type LucideIcon } from "lucide-react";
import type { IAnalyticsCard } from "../../components/common/AnalyticsCard";

// ─── Analytics ────────────────────────────────────────────────────────────────

export const rolesAnalytics: IAnalyticsCard[] = [
    {
        id: 1,
        title: "Total Roles",
        value: "4",
        icon: Shield,
        classname: "bg-main-white border border-main-whiteMarble",
    },
    {
        id: 2,
        title: "Active Users",
        value: "4",
        icon: Users,
        classname: "bg-main-white border border-main-whiteMarble",
    },
    {
        id: 3,
        title: "2FA Enabled",
        value: "3",
        description: "75% of users",
        icon: Shield,
        classname: "bg-main-white border border-main-whiteMarble",
    },
    {
        id: 4,
        title: "Total Users",
        value: "4",
        icon: Users,
        classname: "bg-main-white border border-main-whiteMarble",
    },
];

// ─── Roles ────────────────────────────────────────────────────────────────────

export interface IRolePermissions {
    dashboard: boolean;
    users: boolean;
    drivers: boolean;
    storage: boolean;
    verification: boolean;
    trips: boolean;
}

export interface IRole {
    id: number;
    name: string;
    userCount: number;
    description: string;
    iconBg: string;
    iconText: string;
    icon: LucideIcon;
    permissions: IRolePermissions;
    isProtected?: boolean; // cannot be deleted
}

export const roles: IRole[] = [
    {
        id: 1,
        name: "Admin",
        userCount: 3,
        description: "Full system access with all permissions",
        iconBg: "bg-main-primary",
        iconText: "text-main-white",
        icon: Shield,
        permissions: { dashboard: true, users: true, drivers: true, storage: true, verification: true, trips: true },
        isProtected: true,
    },
    {
        id: 2,
        name: "Finance",
        userCount: 2,
        description: "Financial operations and payout management",
        iconBg: "bg-main-vividMint",
        iconText: "text-main-white",
        icon: Shield,
        permissions: { dashboard: true, users: true, drivers: true, storage: true, verification: true, trips: true },
    },
    {
        id: 3,
        name: "Support",
        userCount: 5,
        description: "Customer support and basic operations",
        iconBg: "bg-main-mustardGold",
        iconText: "text-main-white",
        icon: Shield,
        permissions: { dashboard: true, users: true, drivers: true, storage: true, verification: true, trips: true },
    },
    {
        id: 4,
        name: "SEO / Content Team",
        userCount: 4,
        description: "Content management and SEO optimization",
        iconBg: "bg-main-mirage",
        iconText: "text-main-white",
        icon: Shield,
        permissions: { dashboard: true, users: false, drivers: false, storage: false, verification: false, trips: false },
    },
];

// ─── Admin Users ──────────────────────────────────────────────────────────────

export interface IAdminUser {
    id: number;
    name: string;
    email: string;
    role: string;
    roleBg: string;
    roleText: string;
    lastLogin: string;
    twoFAEnabled: boolean;
    status: "active" | "inactive";
    isCurrentUser?: boolean;
}

export const adminUsers: IAdminUser[] = [
    {
        id: 1,
        name: "Admin User",
        email: "admin@wasel.com",
        role: "Admin",
        roleBg: "bg-main-mirage",
        roleText: "text-main-white",
        lastLogin: "2024-03-23 10:30",
        twoFAEnabled: true,
        status: "active",
        isCurrentUser: true,
    },
    {
        id: 2,
        name: "Sarah Al-Zahrani",
        email: "sarah.finance@wasel.com",
        role: "Finance",
        roleBg: "bg-main-vividMint",
        roleText: "text-main-white",
        lastLogin: "2024-03-23 09:15",
        twoFAEnabled: true,
        status: "active",
    },
    {
        id: 3,
        name: "Omar Hassan",
        email: "omar.support@wasel.com",
        role: "Support",
        roleBg: "bg-main-mustardGold",
        roleText: "text-main-white",
        lastLogin: "2024-03-22 16:45",
        twoFAEnabled: false,
        status: "active",
    },
    {
        id: 4,
        name: "Fatima Al-Mansour",
        email: "fatima.content@wasel.com",
        role: "SEO / Content Team",
        roleBg: "bg-[#9B59B6]",
        roleText: "text-main-white",
        lastLogin: "2024-03-23 08:00",
        twoFAEnabled: true,
        status: "active",
    },
];
