export type TTransactionStatus = "completed" | "pending" | "approved";

export interface ITransaction {
    id: number;
    transactionId: string;
    type: string;
    userOrDriver: string;
    amount: number;
    status: TTransactionStatus;
    date: string;
}

export const transactions: ITransaction[] = [
    { id: 1, transactionId: "TXN-2891", type: "Trip Payment", userOrDriver: "Mohamed Ahmed", amount: 920, status: "completed", date: "Mar 18, 2024 14:30" },
    { id: 2, transactionId: "TXN-2890", type: "Driver Withdrawal", userOrDriver: "Ahmed Hassan", amount: 5200, status: "pending", date: "Mar 18, 2024 12:15" },
    { id: 3, transactionId: "TXN-2889", type: "Trip Payment", userOrDriver: "Fatima Al-Saud", amount: 1250, status: "completed", date: "Mar 18, 2024 11:45" },
    { id: 4, transactionId: "TXN-2888", type: "Driver Withdrawal", userOrDriver: "Khalid Ibrahim", amount: 3800, status: "approved", date: "Mar 18, 2024 09:20" },
    { id: 5, transactionId: "TXN-2887", type: "Trip Payment", userOrDriver: "Sara Ibrahim", amount: 1580, status: "completed", date: "Mar 17, 2024 18:30" },
    { id: 6, transactionId: "TXN-2886", type: "Commission", userOrDriver: "Platform", amount: 138, status: "completed", date: "Mar 17, 2024 18:30" },
];

export const transactionStatusStyles: Record<TTransactionStatus, { bg: string; text: string; label: string }> = {
    completed: { bg: "bg-main-vividMint/10", text: "text-main-vividMint", label: "Completed" },
    pending: { bg: "bg-main-mustardGold/10", text: "text-main-mustardGold", label: "Pending" },
    approved: { bg: "bg-main-primary/10", text: "text-main-primary", label: "Approved" },
};