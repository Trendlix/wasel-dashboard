import PageHeader from "@/shared/components/common/PageHeader";
import PageTransition from "@/shared/components/common/PageTransition";
import CommissionAnalytics from "@/shared/components/pages/commission-and-pricing/CommissionAnalytics";
import CommissionTable from "@/shared/components/pages/commission-and-pricing/CommissionTable";

const CommissionAndPricingPage = () => (
    <PageTransition>
        <PageHeader
            title="Commission & Pricing Control"
            description="Set and manage commission percentages for trips, storage, and advertising"
        />
        <CommissionAnalytics />
        <CommissionTable />
    </PageTransition>
);

export default CommissionAndPricingPage;
