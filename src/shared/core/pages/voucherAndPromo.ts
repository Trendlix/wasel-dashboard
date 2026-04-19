import { Calendar, Tag, Users } from "lucide-react";
import type { IAnalyticsCard } from "@/shared/components/common/AnalyticsCard";
import type { TVoucherStatus } from "@/shared/hooks/store/useVoucherStore";
import type { LucideIcon } from "lucide-react";

export type TVoucherAnalyticsValueKey = "active" | "redemptions" | "expiringSoon" | "total";

export const voucherAnalyticsConfig: Array<
  Pick<IAnalyticsCard, "id" | "classname"> & {
    icon: LucideIcon;
    titleKey: "activeVouchers" | "totalRedemptions" | "expiringSoon" | "totalVouchers";
    descKey: "activeVouchersDesc" | "totalRedemptionsDesc" | "expiringSoonDesc" | "totalVouchersDesc";
    valueKey: TVoucherAnalyticsValueKey;
  }
> = [
  {
    id: 1,
    titleKey: "activeVouchers",
    descKey: "activeVouchersDesc",
    valueKey: "active",
    icon: Tag,
    classname: "bg-main-vividMint",
  },
  {
    id: 2,
    titleKey: "totalRedemptions",
    descKey: "totalRedemptionsDesc",
    valueKey: "redemptions",
    icon: Users,
    classname: "bg-main-voucherDeepPurple",
  },
  {
    id: 3,
    titleKey: "expiringSoon",
    descKey: "expiringSoonDesc",
    valueKey: "expiringSoon",
    icon: Calendar,
    classname: "bg-main-mustardGold",
  },
  {
    id: 4,
    titleKey: "totalVouchers",
    descKey: "totalVouchersDesc",
    valueKey: "total",
    icon: Tag,
    classname: "bg-main-primary",
  },
];

export const voucherStatusStyles: Record<TVoucherStatus, { bg: string; text: string }> = {
  active: { bg: "bg-main-vividMint/10", text: "text-main-vividMint" },
  inactive: { bg: "bg-main-sharkGray/10", text: "text-main-sharkGray" },
  suspended: { bg: "bg-main-mustardGold/15", text: "text-main-mustardGold" },
  expired: { bg: "bg-main-remove/10", text: "text-main-remove" },
};
