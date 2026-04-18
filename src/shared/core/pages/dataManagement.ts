import { Scale, Box, Truck } from "lucide-react";
import type { IAnalyticsCard } from "../../components/common/AnalyticsCard";

// ─── Analytics ────────────────────────────────────────────────────────────────

export const dataManagementAnalytics: IAnalyticsCard[] = [
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
        title: "Active Goods Types",
        value: "5",
        icon: Box,
        classname: "bg-main-vividSubmarine",
    },
    {
        id: 4,
        title: "Weight Types",
        value: "5",
        icon: Scale,
        classname: "bg-main-primaryPurple",
    },
];

// ─── Shared types ─────────────────────────────────────────────────────────────

export type TItemStatus = "active" | "inactive";

export const itemStatusStyles: Record<TItemStatus, { bg: string; text: string; label: string }> = {
    active: { bg: "bg-main-vividMint/10", text: "text-main-vividMint", label: "Active" },
    inactive: { bg: "bg-main-sharkGray/10", text: "text-main-sharkGray", label: "Inactive" },
};

// ─── Truck types ──────────────────────────────────────────────────────────────

export interface ITruckType {
    id: number;
    nameEn: string;
    nameAr: string;
    capacity: string;
    priceKm: string; // Updated from basePrice to priceKm per screenshot
    status: TItemStatus;
}

export const truckTypes: ITruckType[] = [
    { id: 1, nameEn: "Pickup Truck", nameAr: "بيك آب", capacity: "1-2 tons", priceKm: "120 EGP", status: "active" },
    { id: 2, nameEn: "Small Van", nameAr: "فان صغير", capacity: "2-3 tons", priceKm: "220 EGP", status: "active" },
    { id: 3, nameEn: "Medium Truck", nameAr: "شاحنة متوسطة", capacity: "5-7 tons", priceKm: "320 EGP", status: "active" },
    { id: 4, nameEn: "Large Truck", nameAr: "شاحنة كبيرة", capacity: "10-15 tons", priceKm: "420 EGP", status: "active" },
    { id: 5, nameEn: "Refrigerated Truck", nameAr: "شاحنة مبردة", capacity: "5-10 tons", priceKm: "520 EGP", status: "active" },
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
    { id: 1, nameEn: "Small Unit", nameAr: "وحدة صغيرة", size: "50-100 sq ft", status: "active" },
    { id: 2, nameEn: "Medium Unit", nameAr: "وحدة متوسطة", size: "100-200 sq ft", status: "active" },
    { id: 3, nameEn: "Large Unit", nameAr: "وحدة كبيرة", size: "200-400 sq ft", status: "active" },
    { id: 4, nameEn: "Climate Controlled", nameAr: "مكيفة", size: "100-300 sq ft", status: "active" },
    { id: 5, nameEn: "Warehouse Space", nameAr: "مساحة مستودع", size: "500+ sq ft", status: "active" },
];

// ─── Goods types ──────────────────────────────────────────────────────────────

export interface IGoodsType {
    id: number;
    nameEn: string;
    nameAr: string;
    description: string;
    allowedTruckTypes: string;
    status: TItemStatus;
}

export const goodsTypes: IGoodsType[] = [
    { id: 1, nameEn: "Furniture", nameAr: "أثاث", description: "Household and office furniture", allowedTruckTypes: "Small Van, Medium Truck, Large Truck", status: "active" },
    { id: 2, nameEn: "Electronics", nameAr: "إلكترونيات", description: "Electronic devices and appliances", allowedTruckTypes: "Pickup Truck, Small Van", status: "active" },
    { id: 3, nameEn: "Food & Beverages", nameAr: "أطعمة ومشروبات", description: "Perishable and non perishable food items", allowedTruckTypes: "Refrigerated Truck", status: "active" },
    { id: 4, nameEn: "Building Materials", nameAr: "مواد بناء", description: "Construction materials and supplies", allowedTruckTypes: "Medium Truck, Large Truck", status: "active" },
    { id: 5, nameEn: "Fragile Items", nameAr: "أشياء قابلة للكسر", description: "Glass, ceramics, and delicate items", allowedTruckTypes: "Pickup Truck, Small Van", status: "active" },
];

// ─── Weight types ─────────────────────────────────────────────────────────────

export interface IWeightType {
    id: number;
    nameEn: string;
    nameAr: string;
    abbreviation: string;
    status: TItemStatus;
}

export const weightTypes: IWeightType[] = [
    { id: 1, nameEn: "Kilogram", nameAr: "كيلوغرام", abbreviation: "KG", status: "active" },
    { id: 2, nameEn: "Liter", nameAr: "لتر", abbreviation: "L", status: "active" },
    { id: 3, nameEn: "Ton", nameAr: "طن", abbreviation: "T", status: "active" },
    { id: 4, nameEn: "Gram", nameAr: "غرام", abbreviation: "G", status: "active" },
    { id: 5, nameEn: "Milliliter", nameAr: "مليلتر", abbreviation: "ML", status: "active" },
    { id: 6, nameEn: "Pound", nameAr: "رطل", abbreviation: "LB", status: "active" },
];
