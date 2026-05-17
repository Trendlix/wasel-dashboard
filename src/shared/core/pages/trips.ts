import type { IAnalyticsCard } from "../../components/common/AnalyticsCard";
import {
  AlertTriangle,
  MapPin,
  CircleDashed,
  BadgeCheck,
  Calendar,
  Navigation,
  MapPinned,
  Package,
  Truck,
  CheckCircle2,
  Flame,
  List,
  type LucideIcon,
} from "lucide-react";

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

export const TRIP_STATUSES: TTripStatus[] = [
  "pending",
  "accepted",
  "scheduled",
  "on_the_way",
  "arrived",
  "picked_up",
  "delivered",
  "completed",
  "cancelled",
];

export type TTripListTab = "all" | "urgent" | TTripStatus;

export const TRIP_LIST_TABS: TTripListTab[] = [
  "all",
  "urgent",
  "pending",
  "accepted",
  "scheduled",
  "on_the_way",
  "arrived",
  "picked_up",
  "delivered",
  "completed",
  "cancelled",
];

export const TRIP_STATUS_TAB_ICONS: Record<TTripListTab, LucideIcon> = {
  all: List,
  urgent: Flame,
  pending: CircleDashed,
  accepted: BadgeCheck,
  scheduled: Calendar,
  on_the_way: Navigation,
  arrived: MapPinned,
  picked_up: Package,
  delivered: Truck,
  completed: CheckCircle2,
  cancelled: AlertTriangle,
};

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

export const tripListTabStyles: Record<TTripListTab, { active: string; inactive: string }> = {
  all: {
    active: "bg-main-primary text-main-white shadow-[0_8px_18px_rgba(0,74,173,0.35)]",
    inactive: "bg-main-titaniumWhite text-main-primary hover:bg-main-primary/15",
  },
  urgent: {
    active: "bg-orange-500 text-main-white shadow-[0_8px_18px_rgba(249,115,22,0.35)]",
    inactive: "bg-main-titaniumWhite text-orange-600 hover:bg-orange-500/15",
  },
  pending: {
    active: "bg-main-mustardGold text-main-white shadow-[0_8px_18px_rgba(244,174,0,0.35)]",
    inactive: "bg-main-titaniumWhite text-main-mustardGold hover:bg-main-mustardGold/15",
  },
  accepted: {
    active: "bg-main-ladyBlue text-main-white shadow-[0_8px_18px_rgba(129,88,223,0.35)]",
    inactive: "bg-main-titaniumWhite text-main-ladyBlue hover:bg-main-ladyBlue/15",
  },
  scheduled: {
    active: "bg-main-primary text-main-white shadow-[0_8px_18px_rgba(0,74,173,0.35)]",
    inactive: "bg-main-titaniumWhite text-main-primary hover:bg-main-primary/15",
  },
  on_the_way: {
    active: "bg-main-primary text-main-white shadow-[0_8px_18px_rgba(0,74,173,0.35)]",
    inactive: "bg-main-titaniumWhite text-main-primary hover:bg-main-primary/15",
  },
  arrived: {
    active: "bg-main-ladyBlue text-main-white shadow-[0_8px_18px_rgba(129,88,223,0.35)]",
    inactive: "bg-main-titaniumWhite text-main-ladyBlue hover:bg-main-ladyBlue/15",
  },
  picked_up: {
    active: "bg-main-ladyBlue text-main-white shadow-[0_8px_18px_rgba(129,88,223,0.35)]",
    inactive: "bg-main-titaniumWhite text-main-ladyBlue hover:bg-main-ladyBlue/15",
  },
  delivered: {
    active: "bg-main-vividMint text-main-white shadow-[0_8px_18px_rgba(20,195,142,0.35)]",
    inactive: "bg-main-titaniumWhite text-main-vividMint hover:bg-main-vividMint/15",
  },
  completed: {
    active: "bg-main-vividMint text-main-white shadow-[0_8px_18px_rgba(20,195,142,0.35)]",
    inactive: "bg-main-titaniumWhite text-main-vividMint hover:bg-main-vividMint/15",
  },
  cancelled: {
    active: "bg-main-remove text-main-white shadow-[0_8px_18px_rgba(255,76,76,0.35)]",
    inactive: "bg-main-titaniumWhite text-main-remove hover:bg-main-remove/15",
  },
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
