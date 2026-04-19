export type TAnalyticsCardKey = "avgTripValue" | "activeRate" | "userGrowth" | "driverRetention";

export const analyticsCards = [
    { id: 1, cardKey: "avgTripValue" as const, value: "EGP 920", icon: "dollar" },
    { id: 2, cardKey: "activeRate" as const, value: "89%", icon: "trend" },
    { id: 3, cardKey: "userGrowth" as const, value: "+12.5%", icon: "users" },
    { id: 4, cardKey: "driverRetention" as const, value: "94%", icon: "truck" },
];

export type TMonthKey = "jan" | "feb" | "mar" | "apr" | "may" | "jun";

export const tripsRevenueData = [
    { monthKey: "jan" as const, trips: 38000, revenue: 50000 },
    { monthKey: "feb" as const, trips: 43000, revenue: 56000 },
    { monthKey: "mar" as const, trips: 42000, revenue: 50000 },
    { monthKey: "apr" as const, trips: 51000, revenue: 66000 },
    { monthKey: "may" as const, trips: 55000, revenue: 63000 },
    { monthKey: "jun" as const, trips: 68000, revenue: 74000 },
];

export type TVehicleTypeKey = "pickup" | "van" | "smallTruck" | "largeTruck";

export const vehicleDistributionData = [
    { typeKey: "pickup" as const, value: 32, fill: "#004AAD" },
    { typeKey: "van" as const, value: 24, fill: "#D81B60" },
    { typeKey: "smallTruck" as const, value: 14, fill: "#F4AE00" },
    { typeKey: "largeTruck" as const, value: 18, fill: "#8158DF" },
];

export interface ITopDriver {
    rank: number;
    name: string;
    totalTrips: number;
    totalEarnings: number;
    avgPerTrip: number;
}

export const topDrivers: ITopDriver[] = [
    { rank: 1, name: "Ahmed Hassan", totalTrips: 142, totalEarnings: 28450, avgPerTrip: 200 },
    { rank: 2, name: "Khalid Ibrahim", totalTrips: 168, totalEarnings: 32100, avgPerTrip: 191 },
    { rank: 3, name: "Tariq Khalid", totalTrips: 118, totalEarnings: 24320, avgPerTrip: 206 },
    { rank: 4, name: "Sami Abdullah", totalTrips: 95, totalEarnings: 19850, avgPerTrip: 209 },
    { rank: 5, name: "Omar Al-Fahad", totalTrips: 87, totalEarnings: 18200, avgPerTrip: 209 },
];
