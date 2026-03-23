export type TTripStatus = "completed" | "active" | "cancelled";

export interface ITrip {
    id: number;
    tripId: string;
    user: string;
    driver: string;
    from: string;
    to: string;
    price: number;
    status: TTripStatus;
}

export const trips: ITrip[] = [
    { id: 1, tripId: "#920", user: "Mohamed Ahmed", driver: "Ahmed Hassan", from: "Al Olaya, Riyadh", to: "King Fahd District", price: 920, status: "completed" },
    { id: 2, tripId: "#921", user: "Fatima Al-Saud", driver: "Khalid Ibrahim", from: "Al Malaz", to: "Al Naseem", price: 1250, status: "completed" },
    { id: 3, tripId: "#922", user: "Sara Ibrahim", driver: "Omar Al-Fahad", from: "Downtown", to: "Industrial Area", price: 1580, status: "active" },
    { id: 4, tripId: "#923", user: "Khalid Al-Otaibi", driver: "Sami Abdullah", from: "Al Yasmin", to: "Al Narjis", price: 780, status: "active" },
    { id: 5, tripId: "#924", user: "Nora Abdullah", driver: "Tariq Khalid", from: "Al Nakheel", to: "Al Qirawan", price: 650, status: "cancelled" },
    { id: 6, tripId: "#925", user: "Layla Mohammed", driver: "Faisal Nasser", from: "Al Hamra", to: "Al Zahra", price: 1010, status: "completed" },
    { id: 7, tripId: "#926", user: "Omar Fahad", driver: "Yousef Mohammed", from: "Al Rimal", to: "Al Rawdah", price: 870, status: "active" },
];

export const tripStatusStyles: Record<TTripStatus, { bg: string; text: string; label: string }> = {
    completed: { bg: "bg-main-vividMint/10", text: "text-main-vividMint", label: "Completed" },
    active: { bg: "bg-main-primary/10", text: "text-main-primary", label: "Active" },
    cancelled: { bg: "bg-main-remove/10", text: "text-main-remove", label: "Cancelled" },
};