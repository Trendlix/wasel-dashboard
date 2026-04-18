import { CheckCircle2, FileText, XCircle } from "lucide-react";
import type { IAnalyticsCard } from "@/shared/components/common/AnalyticsCard";

export type TVerificationStatus = "pending" | "approved" | "rejected";

export const verificationStatusStyles: Record<
  TVerificationStatus,
  { bg: string; text: string; label: string }
> = {
  pending: { bg: "bg-main-mustardGold/10", text: "text-main-mustardGold", label: "Pending" },
  approved: { bg: "bg-main-vividMint/10", text: "text-main-vividMint", label: "Approved" },
  rejected: { bg: "bg-main-remove/10", text: "text-main-remove", label: "Rejected" },
};

export const verificationAnalyticsConfig: Omit<IAnalyticsCard, "value">[] = [
  {
    id: 1,
    title: "Pending Reviews",
    icon: FileText,
    classname: "bg-main-white border border-main-whiteMarble",
  },
  {
    id: 2,
    title: "Approved",
    icon: CheckCircle2,
    classname: "bg-main-white border border-main-whiteMarble",
  },
  {
    id: 3,
    title: "Rejected",
    icon: XCircle,
    classname: "bg-main-white border border-main-whiteMarble",
  },
];
