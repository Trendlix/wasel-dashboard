export type TDriverStatus = "approved" | "pending" | "rejected";
export type TVehicleType = "Pickup Truck" | "Van" | "Small Truck" | "Large Truck";

export interface IDriver {
    id: number;
    name: string;
    joinDate: string;
    vehicleType: TVehicleType;
    status: TDriverStatus;
    earnings: number;
    trips: number;
    rating: number | null;
}

export const drivers: IDriver[] = [
    { id: 1, name: "Ahmed Hassan", joinDate: "Dec 10, 2023", vehicleType: "Pickup Truck", status: "approved", earnings: 28450, trips: 142, rating: 4.8 },
    { id: 2, name: "Khalid Ibrahim", joinDate: "Nov 15, 2023", vehicleType: "Van", status: "approved", earnings: 32100, trips: 168, rating: 4.9 },
    { id: 3, name: "Omar Al-Fahad", joinDate: "Mar 18, 2024", vehicleType: "Small Truck", status: "pending", earnings: 0, trips: 0, rating: null },
    { id: 4, name: "Sami Abdullah", joinDate: "Jan 20, 2024", vehicleType: "Pickup Truck", status: "approved", earnings: 19850, trips: 95, rating: 4.6 },
    { id: 5, name: "Yousef Mohammed", joinDate: "Mar 15, 2024", vehicleType: "Large Truck", status: "rejected", earnings: 0, trips: 0, rating: null },
    { id: 6, name: "Tariq Khalid", joinDate: "Jan 5, 2024", vehicleType: "Van", status: "approved", earnings: 24320, trips: 118, rating: 4.7 },
    { id: 7, name: "Mansour Saleh", joinDate: "Mar 17, 2024", vehicleType: "Pickup Truck", status: "pending", earnings: 0, trips: 0, rating: null },
    { id: 8, name: "Faisal Nasser", joinDate: "Feb 8, 2024", vehicleType: "Large Truck", status: "approved", earnings: 41200, trips: 210, rating: 4.9 },
];

export const driverStatusStyles: Record<TDriverStatus, { bg: string; text: string; label: string }> = {
    approved: { bg: "bg-main-vividMint/10", text: "text-main-vividMint", label: "Approved" },
    pending: { bg: "bg-main-mustardGold/10", text: "text-main-mustardGold", label: "Pending" },
    rejected: { bg: "bg-main-remove/10", text: "text-main-remove", label: "Rejected" },
};

export const driverAnalytics = [
    { id: 1, label: "Total Drivers", value: "892", icon: "Truck" },
    { id: 2, label: "Active Drivers", value: "756", icon: "TruckIcon" },
    { id: 3, label: "Pending Approval", value: "28", icon: "Clock" },
    { id: 4, label: "Total Earnings", value: "EGP 2.4M", icon: "DollarSign" },
];