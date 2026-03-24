import { Percent } from "lucide-react";
import type { IAnalyticsCard } from "../../components/common/AnalyticsCard";

// ─── Analytics ────────────────────────────────────────────────────────────────

export const commissionAnalytics: IAnalyticsCard[] = [
    {
        id: 1,
        title: "Avg. Trip Commission",
        value: "13.5%",
        description: "Based on current rates",
        icon: Percent,
        classname: "bg-main-white border border-main-whiteMarble",
    },
    {
        id: 2,
        title: "Avg. Storage Commission",
        value: "9%",
        description: "Based on current rates",
        icon: Percent,
        classname: "bg-main-white border border-main-whiteMarble",
    },
    {
        id: 3,
        title: "Avg. Ad Commission",
        value: "22.5%",
        description: "Based on current rates",
        icon: Percent,
        classname: "bg-main-white border border-main-whiteMarble",
    },
];

// ─── Commission rates ─────────────────────────────────────────────────────────

export type TCommissionCategory = "trips" | "storage" | "advertising";

export interface ICommissionRate {
    id: number;
    category: TCommissionCategory;
    description: string;
    type: string;
    rate: string;
}

export const categoryStyles: Record<TCommissionCategory, { bg: string; text: string; label: string }> = {
    trips:       { bg: "bg-main-primary",      text: "text-main-white", label: "Trips"       },
    storage:     { bg: "bg-main-vividMint",    text: "text-main-white", label: "Storage"     },
    advertising: { bg: "bg-main-mustardGold",  text: "text-main-white", label: "Advertising" },
};

export const commissionRates: ICommissionRate[] = [
    { id: 1, category: "trips",       description: "Standard trip commission",  type: "Percentage", rate: "15%" },
    { id: 2, category: "trips",       description: "Long distance (>100km)",    type: "Percentage", rate: "12%" },
    { id: 3, category: "storage",     description: "Daily storage booking",     type: "Percentage", rate: "10%" },
    { id: 4, category: "storage",     description: "Monthly storage booking",   type: "Percentage", rate: "8%"  },
    { id: 5, category: "advertising", description: "Campaign commission",       type: "Percentage", rate: "20%" },
    { id: 6, category: "advertising", description: "Featured placement",        type: "Percentage", rate: "25%" },
];
