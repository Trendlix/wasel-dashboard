import type { IAnalyticsCard } from "../../components/common/AnalyticsCard";
import { MapPin } from "lucide-react";

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

export const tripStatusStyles: Record<TTripStatus, { bg: string; text: string; label: string }> = {
  pending: { bg: "bg-main-mustardGold/10", text: "text-main-mustardGold", label: "Pending" },
  accepted: { bg: "bg-main-ladyBlue/10", text: "text-main-ladyBlue", label: "Accepted" },
  scheduled: { bg: "bg-main-primary/10", text: "text-main-primary", label: "Scheduled" },
  on_the_way: { bg: "bg-main-primary/10", text: "text-main-primary", label: "On The Way" },
  arrived: { bg: "bg-main-ladyBlue/10", text: "text-main-ladyBlue", label: "Arrived" },
  picked_up: { bg: "bg-main-ladyBlue/10", text: "text-main-ladyBlue", label: "Picked Up" },
  delivered: { bg: "bg-main-vividMint/10", text: "text-main-vividMint", label: "Delivered" },
  completed: { bg: "bg-main-vividMint/10", text: "text-main-vividMint", label: "Completed" },
  cancelled: { bg: "bg-main-remove/10", text: "text-main-remove", label: "Cancelled" },
};

export const tripsAnalyticsConfig: Omit<IAnalyticsCard, "value">[] = [
  { id: 1, title: "Total Trips", icon: MapPin, classname: "bg-main-white border border-main-whiteMarble" },
  { id: 2, title: "Active Trips", icon: MapPin, classname: "bg-main-white border border-main-whiteMarble" },
  { id: 3, title: "Completed Trips", icon: MapPin, classname: "bg-main-white border border-main-whiteMarble" },
  { id: 4, title: "Cancelled Trips", icon: MapPin, classname: "bg-main-white border border-main-whiteMarble" },
];
