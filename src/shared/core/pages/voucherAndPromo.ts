import { Calendar, Tag, Users } from "lucide-react";
import type { IAnalyticsCard } from "@/shared/components/common/AnalyticsCard";
import type { TVoucherStatus } from "@/shared/hooks/store/useVoucherStore";

export const voucherAnalyticsConfig: Omit<IAnalyticsCard, "value">[] = [
  {
    id: 1,
    title: "Active Vouchers",
    description: "Currently running",
    icon: Tag,
    classname: "bg-main-vividMint",
  },
  {
    id: 2,
    title: "Total Redemptions",
    description: "Across all vouchers",
    icon: Users,
    classname: "bg-main-voucherDeepPurple",
  },
  {
    id: 3,
    title: "Expiring Soon",
    description: "Within 30 days",
    icon: Calendar,
    classname: "bg-main-mustardGold",
  },
  {
    id: 4,
    title: "Total Vouchers",
    description: "All created vouchers",
    icon: Tag,
    classname: "bg-main-primary",
  },
];

export const voucherStatusStyles: Record<TVoucherStatus, { bg: string; text: string; label: string }> = {
  active: { bg: "bg-main-vividMint/10", text: "text-main-vividMint", label: "Active" },
  inactive: { bg: "bg-main-sharkGray/10", text: "text-main-sharkGray", label: "Inactive" },
  suspended: { bg: "bg-main-mustardGold/15", text: "text-main-mustardGold", label: "Suspended" },
  expired: { bg: "bg-main-remove/10", text: "text-main-remove", label: "Expired" },
};

export const voucherStatusFilterOptions = [
  { value: "all", label: "All statuses" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "suspended", label: "Suspended" },
  { value: "expired", label: "Expired" },
];
