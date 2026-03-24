import PageHeader from "@/shared/components/common/PageHeader";
import PageTransition from "@/shared/components/common/PageTransition";
import Analytics from "@/shared/components/pages/wallet-and-finance/Analytics";
import TransactionsTable from "@/shared/components/pages/wallet-and-finance/TransactionsTable";
import PendingWithdrawals from "@/shared/components/pages/wallet-and-finance/PendingWithdrawals";

const WalletAndFinancePage = () => {
    return (
        <PageTransition>
            <PageHeader title="Wallet / Finance" description="Manage platform finances and payouts" />
            <Analytics />
            <PendingWithdrawals />
            <TransactionsTable />
        </PageTransition>
    );
};

export default WalletAndFinancePage;