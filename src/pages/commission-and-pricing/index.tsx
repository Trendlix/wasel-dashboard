import { useTranslation } from "react-i18next";
import PageHeader from "@/shared/components/common/PageHeader";
import PageTransition from "@/shared/components/common/PageTransition";
import CommissionAnalytics from "@/shared/components/pages/commission-and-pricing/CommissionAnalytics";
import CommissionTable from "@/shared/components/pages/commission-and-pricing/CommissionTable";

const CommissionAndPricingPage = () => {
    const { t } = useTranslation("commission");
    return (
    <PageTransition>
        <PageHeader title={t("pageTitle")} description={t("pageDescription")} />
        <CommissionAnalytics />
        <CommissionTable />
    </PageTransition>
    );
};

export default CommissionAndPricingPage;
