export type TStorageStatus = "approved" | "pending" | "rejected";

export interface IStorageOwner {
    id: number;
    owner: string;
    location: string;
    capacity: number; // m²
    pricingPerDay: number; // EGP/day
    status: TStorageStatus;
    bookings: number;
}

export const storageOwners: IStorageOwner[] = [
    { id: 1, owner: "Abdullah Trading Co.", location: "Riyadh, Al Olaya", capacity: 500, pricingPerDay: 50, status: "approved", bookings: 24 },
    { id: 2, owner: "Al-Fahad Storage", location: "Jeddah, Al Hamra", capacity: 800, pricingPerDay: 75, status: "approved", bookings: 38 },
    { id: 3, owner: "Modern Warehouse", location: "Riyadh, King Fahd District", capacity: 300, pricingPerDay: 40, status: "pending", bookings: 0 },
    { id: 4, owner: "City Storage Solutions", location: "Dammam, Al Faisaliah", capacity: 1000, pricingPerDay: 100, status: "approved", bookings: 52 },
    { id: 5, owner: "Eastern Vault", location: "Khobar, Al Aqrabiyah", capacity: 650, pricingPerDay: 68, status: "pending", bookings: 0 },
    { id: 6, owner: "Prime Hold", location: "Makkah, Al Aziziyah", capacity: 420, pricingPerDay: 55, status: "approved", bookings: 19 },
    { id: 7, owner: "SafeSpace Logistics", location: "Madinah, Al Qiblatayn", capacity: 720, pricingPerDay: 82, status: "rejected", bookings: 0 },
];

export const storageStatusStyles: Record<TStorageStatus, { bg: string; text: string; label: string }> = {
    approved: { bg: "bg-main-vividMint/10", text: "text-main-vividMint", label: "Approved" },
    pending: { bg: "bg-main-mustardGold/10", text: "text-main-mustardGold", label: "Pending" },
    rejected: { bg: "bg-main-remove/10", text: "text-main-remove", label: "Rejected" },
};