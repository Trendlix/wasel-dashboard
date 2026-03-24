import { Archive, Truck } from "lucide-react";
import type { IAnalyticsCard } from "../../components/common/AnalyticsCard";

// ─── Analytics ────────────────────────────────────────────────────────────────

export const trucksStoragesAnalytics: IAnalyticsCard[] = [
    {
        id: 1,
        title: "Active Truck Types",
        value: "5",
        icon: Truck,
        classname: "bg-main-vividMint",
    },
    {
        id: 2,
        title: "Total Truck Types",
        value: "5",
        icon: Truck,
        classname: "bg-main-primary",
    },
    {
        id: 3,
        title: "Active Storage Types",
        value: "5",
        icon: Archive,
        classname: "bg-main-vividMint",
    },
    {
        id: 4,
        title: "Total Storage Types",
        value: "5",
        icon: Archive,
        classname: "bg-main-mustardGold",
    },
];

// ─── Truck types ──────────────────────────────────────────────────────────────

export type TItemStatus = "active" | "inactive";

export interface ITruckType {
    id: number;
    nameEn: string;
    nameAr: string;
    capacity: string;
    basePrice: string;
    status: TItemStatus;
}

export const truckTypes: ITruckType[] = [
    { id: 1, nameEn: "Pickup Truck",       nameAr: "بيك آب",           capacity: "1-2 tons",   basePrice: "150 SAR", status: "active" },
    { id: 2, nameEn: "Small Van",          nameAr: "فان صغير",          capacity: "2-3 tons",   basePrice: "200 SAR", status: "active" },
    { id: 3, nameEn: "Medium Truck",       nameAr: "شاحنة متوسطة",     capacity: "5-7 tons",   basePrice: "350 SAR", status: "active" },
    { id: 4, nameEn: "Large Truck",        nameAr: "شاحنة كبيرة",      capacity: "10-15 tons", basePrice: "500 SAR", status: "active" },
    { id: 5, nameEn: "Refrigerated Truck", nameAr: "شاحنة مبردة",      capacity: "5-10 tons",  basePrice: "600 SAR", status: "active" },
];

// ─── Storage types ────────────────────────────────────────────────────────────

export interface IStorageType {
    id: number;
    nameEn: string;
    nameAr: string;
    size: string;
    status: TItemStatus;
}

export const storageTypes: IStorageType[] = [
    { id: 1, nameEn: "Small Unit",         nameAr: "وحدة صغيرة",       size: "50-100 sq ft",  status: "active" },
    { id: 2, nameEn: "Medium Unit",        nameAr: "وحدة متوسطة",      size: "100-200 sq ft", status: "active" },
    { id: 3, nameEn: "Large Unit",         nameAr: "وحدة كبيرة",       size: "200-400 sq ft", status: "active" },
    { id: 4, nameEn: "Climate Controlled", nameAr: "مكيفة",             size: "100-300 sq ft", status: "active" },
    { id: 5, nameEn: "Warehouse Space",    nameAr: "مساحة مستودع",     size: "500+ sq ft",    status: "active" },
];

// ─── Shared style map ─────────────────────────────────────────────────────────

export const itemStatusStyles: Record<TItemStatus, { bg: string; text: string; label: string }> = {
    active:   { bg: "bg-main-vividMint/10", text: "text-main-vividMint", label: "Active"   },
    inactive: { bg: "bg-main-sharkGray/10", text: "text-main-sharkGray", label: "Inactive" },
};
