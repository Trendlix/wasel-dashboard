import type { IAnalyticsCard } from "../../components/common/AnalyticsCard";
import { MapPin, type LucideIcon } from "lucide-react";

export type TTripStatus =
  | "pending"
  | "accepted"
  | "scheduled"
  | "on_the_way"
  | "arrived"
  | "picked_up"
  | "delivered"
  | "completed"
  | "cancelled";

export const tripStatusStyles: Record<TTripStatus, { bg: string; text: string }> = {
  pending: { bg: "bg-main-mustardGold/10", text: "text-main-mustardGold" },
  accepted: { bg: "bg-main-ladyBlue/10", text: "text-main-ladyBlue" },
  scheduled: { bg: "bg-main-primary/10", text: "text-main-primary" },
  on_the_way: { bg: "bg-main-primary/10", text: "text-main-primary" },
  arrived: { bg: "bg-main-ladyBlue/10", text: "text-main-ladyBlue" },
  picked_up: { bg: "bg-main-ladyBlue/10", text: "text-main-ladyBlue" },
  delivered: { bg: "bg-main-vividMint/10", text: "text-main-vividMint" },
  completed: { bg: "bg-main-vividMint/10", text: "text-main-vividMint" },
  cancelled: { bg: "bg-main-remove/10", text: "text-main-remove" },
};

export const tripsAnalyticsConfig: Array<
  Pick<IAnalyticsCard, "id" | "classname"> & {
    icon: LucideIcon;
    titleKey: "totalTrips" | "activeTrips" | "completedTrips" | "cancelledTrips";
  }
> = [
  { id: 1, titleKey: "totalTrips", icon: MapPin, classname: "bg-main-white border border-main-whiteMarble" },
  { id: 2, titleKey: "activeTrips", icon: MapPin, classname: "bg-main-white border border-main-whiteMarble" },
  { id: 3, titleKey: "completedTrips", icon: MapPin, classname: "bg-main-white border border-main-whiteMarble" },
  { id: 4, titleKey: "cancelledTrips", icon: MapPin, classname: "bg-main-white border border-main-whiteMarble" },
];
