import type { IAnalyticsCard } from "../../components/common/AnalyticsCard";
import { CircleDashed, Clock, BadgeCheck, XCircle, List, type LucideIcon } from "lucide-react";

export type TRequestStatus = "pending" | "expired" | "confirmed" | "cancelled";

export type TRequestListTab = "all" | TRequestStatus;

export const REQUEST_LIST_TABS: TRequestListTab[] = [
  "all",
  "pending",
  "expired",
  // "confirmed",
  "cancelled",
];

/** @deprecated Use REQUEST_LIST_TABS */
export const REQUEST_STATUS_TABS: TRequestStatus[] = [
  "pending",
  "expired",
  // "confirmed",
  "cancelled",
];

export const requestStatusStyles: Record<TRequestStatus, { bg: string; text: string }> = {
  pending: { bg: "bg-main-mustardGold/10", text: "text-main-mustardGold" },
  expired: { bg: "bg-main-sharkGray/10", text: "text-main-sharkGray" },
  confirmed: { bg: "bg-main-vividMint/10", text: "text-main-vividMint" },
  cancelled: { bg: "bg-main-remove/10", text: "text-main-remove" },
};

export const requestListTabStyles: Record<TRequestListTab, { active: string; inactive: string }> = {
  all: {
    active: "bg-main-primary text-main-white shadow-[0_8px_18px_rgba(0,74,173,0.35)]",
    inactive: "bg-main-titaniumWhite text-main-primary hover:bg-main-primary/15",
  },
  pending: {
    active: "bg-main-mustardGold text-main-white shadow-[0_8px_18px_rgba(244,174,0,0.35)]",
    inactive: "bg-main-titaniumWhite text-main-mustardGold hover:bg-main-mustardGold/15",
  },
  expired: {
    active: "bg-main-sharkGray text-main-white shadow-[0_8px_18px_rgba(107,114,128,0.35)]",
    inactive: "bg-main-titaniumWhite text-main-sharkGray hover:bg-main-sharkGray/15",
  },
  confirmed: {
    active: "bg-main-vividMint text-main-white shadow-[0_8px_18px_rgba(20,195,142,0.35)]",
    inactive: "bg-main-titaniumWhite text-main-vividMint hover:bg-main-vividMint/15",
  },
  cancelled: {
    active: "bg-main-remove text-main-white shadow-[0_8px_18px_rgba(255,76,76,0.35)]",
    inactive: "bg-main-titaniumWhite text-main-remove hover:bg-main-remove/15",
  },
};

/** @deprecated Use requestListTabStyles */
export const requestStatusTabStyles = requestListTabStyles;

export const requestsAnalyticsConfig: Array<
  Pick<IAnalyticsCard, "id" | "classname"> & {
    icon: LucideIcon;
    titleKey: "pending" | "expired" | "confirmed" | "cancelled";
  }
> = [
    { id: 1, titleKey: "pending", icon: CircleDashed, classname: "bg-main-white border border-main-whiteMarble" },
    { id: 2, titleKey: "expired", icon: Clock, classname: "bg-main-white border border-main-whiteMarble" },
    { id: 3, titleKey: "confirmed", icon: BadgeCheck, classname: "bg-main-white border border-main-whiteMarble" },
    { id: 4, titleKey: "cancelled", icon: XCircle, classname: "bg-main-white border border-main-whiteMarble" },
  ];

export const REQUEST_LIST_TAB_ICONS: Record<TRequestListTab, LucideIcon> = {
  all: List,
  pending: CircleDashed,
  expired: Clock,
  confirmed: BadgeCheck,
  cancelled: XCircle,
};

/** @deprecated Use REQUEST_LIST_TAB_ICONS */
export const REQUEST_STATUS_TAB_ICONS = REQUEST_LIST_TAB_ICONS;
