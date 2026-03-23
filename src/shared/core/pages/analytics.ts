export const analyticsCards = [
    { id: 1, title: "Avg. Trip Value", value: "EGP 920", icon: "dollar" },
    { id: 2, title: "Active Rate", value: "89%", icon: "trend" },
    { id: 3, title: "User Growth", value: "+12.5%", icon: "users" },
    { id: 4, title: "Driver Retention", value: "94%", icon: "truck" },
];

export const tripsRevenueData = [
    { month: "Jan", trips: 38000, revenue: 50000 },
    { month: "Feb", trips: 43000, revenue: 56000 },
    { month: "Mar", trips: 42000, revenue: 50000 },
    { month: "Apr", trips: 51000, revenue: 66000 },
    { month: "May", trips: 55000, revenue: 63000 },
    { month: "Jun", trips: 68000, revenue: 74000 },
];

export const vehicleDistributionData = [
    { name: "Pickup", value: 32, fill: "#004AAD" },
    { name: "Van", value: 24, fill: "#D81B60" },
    { name: "Small Truck", value: 14, fill: "#F4AE00" },
    { name: "Large Truck", value: 18, fill: "#8158DF" },
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