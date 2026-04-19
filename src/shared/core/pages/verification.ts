import { CheckCircle2, FileText, XCircle } from "lucide-react";
import type { IAnalyticsCard } from "@/shared/components/common/AnalyticsCard";
import type { LucideIcon } from "lucide-react";

export type TVerificationStatus = "pending" | "approved" | "rejected";

export const verificationStatusStyles: Record<TVerificationStatus, { bg: string; text: string }> = {
  pending: { bg: "bg-main-mustardGold/10", text: "text-main-mustardGold" },
  approved: { bg: "bg-main-vividMint/10", text: "text-main-vividMint" },
  rejected: { bg: "bg-main-remove/10", text: "text-main-remove" },
};

export const verificationAnalyticsConfig: Array<
  Pick<IAnalyticsCard, "id" | "classname"> & {
    icon: LucideIcon;
    titleKey: "pendingReviews" | "approved" | "rejected";
    iconWrapper: string;
  }
> = [
  {
    id: 1,
    titleKey: "pendingReviews",
    icon: FileText,
    classname: "bg-main-white border border-main-whiteMarble",
    iconWrapper: "bg-main-mustardGold/10 text-main-mustardGold",
  },
  {
    id: 2,
    titleKey: "approved",
    icon: CheckCircle2,
    classname: "bg-main-white border border-main-whiteMarble",
    iconWrapper: "bg-main-vividMint/10 text-main-vividMint",
  },
  {
    id: 3,
    titleKey: "rejected",
    icon: XCircle,
    classname: "bg-main-white border border-main-whiteMarble",
    iconWrapper: "bg-main-primary/10 text-main-primary",
  },
];
