import { useTranslation } from "react-i18next";
import PageHeader from "@/shared/components/common/PageHeader";
import PageTransition from "@/shared/components/common/PageTransition";
import Analytics from "@/shared/components/pages/wallet-and-finance/Analytics";
import TransactionsTable from "@/shared/components/pages/wallet-and-finance/TransactionsTable";
import PendingWithdrawals from "@/shared/components/pages/wallet-and-finance/PendingWithdrawals";

const WalletAndFinancePage = () => {
    const { t } = useTranslation("wallet");
    return (
        <PageTransition>
            <PageHeader title={t("pageTitle")} description={t("pageDescription")} />
            <Analytics />
            <PendingWithdrawals />
            <TransactionsTable />
        </PageTransition>
    );
};

export default WalletAndFinancePage;