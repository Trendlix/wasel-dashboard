import { pendingWithdrawals, type IWithdrawalRequest } from "@/shared/core/pages/walletFinance";

// ─── Avatar ───────────────────────────────────────────────────────────────────

const Avatar = ({ name }: { name: string }) => {
    const initials = name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

    return (
        <div className="w-11 h-11 rounded-full bg-main-primary flex items-center justify-center shrink-0">
            <span className="text-main-white text-sm font-bold">{initials}</span>
        </div>
    );
};

// ─── Withdrawal row ───────────────────────────────────────────────────────────

const WithdrawalRow = ({ request }: { request: IWithdrawalRequest }) => (
    <div className="flex items-center justify-between gap-4 py-5 border-b border-main-whiteMarble last:border-0">
        <div className="flex items-center gap-4">
            <Avatar name={request.name} />
            <div>
                <p className="text-main-mirage font-semibold text-sm">{request.name}</p>
                <p className="text-main-sharkGray text-xs mt-0.5">Requested {request.requestedDate}</p>
            </div>
        </div>

        <div className="flex items-center gap-4">
            <span className="text-main-primary font-bold text-base">
                EGP {request.amount.toLocaleString()}
            </span>
            <button className="px-5 h-9 bg-main-vividMint text-main-white text-sm font-semibold rounded-lg hover:bg-main-vividMint/90 transition-colors">
                Approve
            </button>
            <button className="px-5 h-9 bg-main-remove text-main-white text-sm font-semibold rounded-lg hover:bg-main-remove/90 transition-colors">
                Reject
            </button>
        </div>
    </div>
);

// ─── Pending withdrawals ──────────────────────────────────────────────────────

const PendingWithdrawals = () => (
    <div className="bg-main-white border border-main-whiteMarble common-rounded p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
            <h2 className="text-main-mirage font-bold text-lg">Pending Withdrawal Requests</h2>
            <span className="w-7 h-7 rounded-full bg-main-primary text-main-white text-xs font-bold flex items-center justify-center">
                {pendingWithdrawals.length}
            </span>
        </div>

        {/* Rows */}
        <div>
            {pendingWithdrawals.map((request) => (
                <WithdrawalRow key={request.id} request={request} />
            ))}
        </div>
    </div>
);

export default PendingWithdrawals;
