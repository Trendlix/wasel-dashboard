import { Users } from "lucide-react";
import type { IAnalyticsCard } from "../../components/common/AnalyticsCard";


export const usersAnalytics: IAnalyticsCard[] = [
    {
        id: 1,
        title: "Total Users",
        value: "12,345",
        icon: Users,
        classname: "bg-main-white border border-main-whiteMarble"
    },
    {
        id: 2,
        title: "Active Users",
        value: "8,910",
        icon: Users,
        classname: "bg-main-white border border-main-whiteMarble"
    },
    {
        id: 3,
        title: "Blocked Users",
        value: "45",
        icon: Users,
        classname: "bg-main-white border border-main-whiteMarble"
    }
]

export type TUserStatus = "active" | "inactive" | "blocked";

export interface IUser {
    id: number;
    name: string;
    email: string;
    phone: string;
    status: TUserStatus;
    totalTrips: number;
    joinDate: string;
}

export const users: IUser[] = [
    { id: 1, name: "Mohamed Ahmed", email: "mohamed.ahmed@email.com", phone: "+966 50 123 4567", status: "active", totalTrips: 24, joinDate: "Jan 15, 2024" },
    { id: 2, name: "Fatima Al-Saud", email: "fatima.saud@email.com", phone: "+966 55 234 5678", status: "active", totalTrips: 18, joinDate: "Feb 3, 2024" },
    { id: 3, name: "Ahmed Hassan", email: "ahmed.hassan@email.com", phone: "+966 56 345 6789", status: "active", totalTrips: 32, joinDate: "Dec 20, 2023" },
    { id: 4, name: "Sara Ibrahim", email: "sara.ibrahim@email.com", phone: "+966 53 456 7890", status: "inactive", totalTrips: 5, joinDate: "Mar 10, 2024" },
    { id: 5, name: "Khalid Al-Otaibi", email: "khalid.otaibi@email.com", phone: "+966 54 567 8901", status: "blocked", totalTrips: 12, joinDate: "Jan 28, 2024" },
    { id: 6, name: "Nora Abdullah", email: "nora.abdullah@email.com", phone: "+966 50 678 9012", status: "active", totalTrips: 45, joinDate: "Nov 5, 2023" },
    { id: 7, name: "Omar Fahad", email: "omar.fahad@email.com", phone: "+966 55 789 0123", status: "active", totalTrips: 28, joinDate: "Feb 17, 2024" },
    { id: 8, name: "Layla Mohammed", email: "layla.mohammed@email.com", phone: "+966 56 890 1234", status: "active", totalTrips: 15, joinDate: "Mar 2, 2024" },
];

export const statusStyles: Record<TUserStatus, { bg: string; text: string; label: string }> = {
    active: { bg: "bg-main-vividMint/10", text: "text-main-vividMint", label: "Active" },
    inactive: { bg: "bg-main-sharkGray/10", text: "text-main-sharkGray", label: "Inactive" },
    blocked: { bg: "bg-main-remove/10", text: "text-main-remove", label: "Blocked" },
};