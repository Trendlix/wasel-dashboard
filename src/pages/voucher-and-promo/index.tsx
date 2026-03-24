import PageHeader from "@/shared/components/common/PageHeader";
import PageTransition from "@/shared/components/common/PageTransition";
import VoucherAnalytics from "@/shared/components/pages/voucher-and-promo/VoucherAnalytics";
import VoucherTable from "@/shared/components/pages/voucher-and-promo/VoucherTable";

const VoucherAndPromoPage = () => (
    <PageTransition>
        <PageHeader
            title="Voucher & Promo Code System"
            description="Create and manage promotional vouchers for different user groups"
        />
        <VoucherAnalytics />
        <VoucherTable />
    </PageTransition>
);

export default VoucherAndPromoPage;
