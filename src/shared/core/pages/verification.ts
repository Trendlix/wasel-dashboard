export type TVerificationStatus = "pending" | "approved" | "rejected";
export type TVerificationType = "Driver" | "Storage Owner";

export interface IVerificationItem {
    id: number;
    name: string;
    type: TVerificationType;
    submittedAt: string;
    status: TVerificationStatus;
    documents: string[];
}

export const verificationItems: IVerificationItem[] = [
    {
        id: 1,
        name: "Ahmed Hassan",
        type: "Driver",
        submittedAt: "Mar 17, 2024",
        status: "pending",
        documents: ["ID", "License", "Vehicle Reg"],
    },
    {
        id: 2,
        name: "Sarah Al-Rashid",
        type: "Storage Owner",
        submittedAt: "Mar 17, 2024",
        status: "pending",
        documents: ["ID", "Property Deed"],
    },
    {
        id: 3,
        name: "Omar Al-Fahad",
        type: "Driver",
        submittedAt: "Mar 16, 2024",
        status: "pending",
        documents: ["ID", "License", "Vehicle Reg"],
    },
    {
        id: 4,
        name: "Nora Abdullah",
        type: "Driver",
        submittedAt: "Mar 15, 2024",
        status: "approved",
        documents: ["ID", "License"],
    },
    {
        id: 5,
        name: "Abdullah Trading Co.",
        type: "Storage Owner",
        submittedAt: "Mar 14, 2024",
        status: "approved",
        documents: ["ID", "Property Deed"],
    },
    {
        id: 6,
        name: "Yousef Mohammed",
        type: "Driver",
        submittedAt: "Mar 12, 2024",
        status: "rejected",
        documents: ["ID"],
    },
];

export const verificationStatusStyles: Record<
    TVerificationStatus,
    { bg: string; text: string; label: string }
> = {
    pending: { bg: "bg-main-mustardGold/10", text: "text-main-mustardGold", label: "Pending" },
    approved: { bg: "bg-main-vividMint/10", text: "text-main-vividMint", label: "Approved" },
    rejected: { bg: "bg-main-remove/10", text: "text-main-remove", label: "Rejected" },
};