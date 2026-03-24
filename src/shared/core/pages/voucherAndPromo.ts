import { Calendar, Tag, Users } from "lucide-react";
import type { IAnalyticsCard } from "../../components/common/AnalyticsCard";

// ─── Analytics ────────────────────────────────────────────────────────────────

export const voucherAnalytics: IAnalyticsCard[] = [
    {
        id: 1,
        title: "Active Vouchers",
        value: "4",
        description: "Currently running",
        icon: Tag,
        classname: "bg-main-vividMint",
    },
    {
        id: 2,
        title: "Total Redemptions",
        value: "1019",
        description: "Across all vouchers",
        icon: Users,
        classname: "bg-main-secondary",
    },
    {
        id: 3,
        title: "Expiring Soon",
        value: "2",
        description: "Within 30 days",
        icon: Calendar,
        classname: "bg-main-mustardGold",
    },
    {
        id: 4,
        title: "Total Vouchers",
        value: "5",
        description: "All time created",
        icon: Tag,
        classname: "bg-main-primary",
    },
];

// ─── Types ────────────────────────────────────────────────────────────────────

export type TVoucherStatus     = "active" | "expired";
export type TVoucherTargetGroup = "users" | "drivers" | "companies" | "advertisers";
export type TDiscountType      = "percentage" | "fixed";

// ─── Interfaces ───────────────────────────────────────────────────────────────

export interface IVoucher {
    id: number;
    code: string;
    discountType: TDiscountType;
    discountValue: string;
    targetGroup: TVoucherTargetGroup;
    usageCount: number;
    usageLimit: number;
    expiryDate: string;
    status: TVoucherStatus;
}

// ─── Style maps ───────────────────────────────────────────────────────────────

export const targetGroupStyles: Record<TVoucherTargetGroup, { bg: string; text: string; label: string }> = {
    users:       { bg: "bg-main-vividMint",   text: "text-main-white", label: "Users"       },
    drivers:     { bg: "bg-main-primary",     text: "text-main-white", label: "Drivers"     },
    companies:   { bg: "bg-main-mustardGold", text: "text-main-white", label: "Companies"   },
    advertisers: { bg: "bg-[#4F46E5]",        text: "text-main-white", label: "Advertisers" },
};

export const statusStyles: Record<TVoucherStatus, { bg: string; text: string; label: string }> = {
    active:  { bg: "bg-main-vividMint/10", text: "text-main-vividMint", label: "Active"  },
    expired: { bg: "",                     text: "text-main-sharkGray",  label: "Expired" },
};

// ─── Mock data ────────────────────────────────────────────────────────────────

export const vouchers: IVoucher[] = [
    { id: 1, code: "WELCOME2024",  discountType: "percentage", discountValue: "20%",     targetGroup: "users",       usageCount: 342, usageLimit: 1000, expiryDate: "2024-12-31", status: "active"  },
    { id: 2, code: "DRIVER50",     discountType: "fixed",      discountValue: "50 EGP",  targetGroup: "drivers",     usageCount: 487, usageLimit: 500,  expiryDate: "2024-06-30", status: "active"  },
    { id: 3, code: "FLASH15",      discountType: "percentage", discountValue: "15%",     targetGroup: "companies",   usageCount: 100, usageLimit: 100,  expiryDate: "2024-03-20", status: "expired" },
    { id: 4, code: "ADCAMPAIGN",   discountType: "percentage", discountValue: "25%",     targetGroup: "advertisers", usageCount: 12,  usageLimit: 50,   expiryDate: "2024-09-30", status: "active"  },
    { id: 5, code: "STORAGE10",    discountType: "fixed",      discountValue: "100 EGP", targetGroup: "users",       usageCount: 78,  usageLimit: 200,  expiryDate: "2024-08-15", status: "active"  },
    { id: 6, code: "FLASH15",      discountType: "percentage", discountValue: "15%",     targetGroup: "companies",   usageCount: 100, usageLimit: 100,  expiryDate: "2024-03-20", status: "expired" },
    { id: 7, code: "ADCAMPAIGN",   discountType: "percentage", discountValue: "25%",     targetGroup: "advertisers", usageCount: 12,  usageLimit: 50,   expiryDate: "2024-09-30", status: "active"  },
    { id: 8, code: "STORAGE10",    discountType: "fixed",      discountValue: "100 EGP", targetGroup: "users",       usageCount: 78,  usageLimit: 200,  expiryDate: "2024-08-15", status: "active"  },
];

// ─── Filter options ───────────────────────────────────────────────────────────

export const STATUS_OPTIONS: { value: TVoucherStatus | ""; label: string }[] = [
    { value: "",        label: "All Statuses" },
    { value: "active",  label: "Active"       },
    { value: "expired", label: "Expired"      },
];

export const TARGET_GROUP_OPTIONS: { value: TVoucherTargetGroup | ""; label: string }[] = [
    { value: "",            label: "All Groups"  },
    { value: "users",       label: "Users"       },
    { value: "drivers",     label: "Drivers"     },
    { value: "companies",   label: "Companies"   },
    { value: "advertisers", label: "Advertisers" },
];
