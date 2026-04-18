import PageHeader from "@/shared/components/common/PageHeader";
import PageTransition from "@/shared/components/common/PageTransition";
import VoucherAnalytics from "@/shared/components/pages/voucher-and-promo/VoucherAnalytics";
import VoucherTable from "@/shared/components/pages/voucher-and-promo/VoucherTable";

const VoucherAndPromoPage = () => (
  <PageTransition>
    <PageHeader
      title="Voucher & Promo Code System"
      description="Create, edit, disable, and export promotional vouchers"
    />
    <VoucherAnalytics />
    <VoucherTable />
  </PageTransition>
);

export default VoucherAndPromoPage;
