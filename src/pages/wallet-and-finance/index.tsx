import PageHeader from "@/shared/components/common/PageHeader";
import PageTransition from "@/shared/components/common/PageTransition";
import Analytics from "@/shared/components/pages/wallet-and-finance/Analytics";
import TransactionsTable from "@/shared/components/pages/wallet-and-finance/TransactionsTable";

const WalletAndFinancePage = () => {
    return (
        <PageTransition>
            <PageHeader title="Wallet / Finance" description="Manage platform finances and payouts" />
            <Analytics />
            <TransactionsTable />
        </PageTransition>
    );
};

export default WalletAndFinancePage;