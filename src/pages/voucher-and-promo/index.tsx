import { useTranslation } from "react-i18next";
import PageHeader from "@/shared/components/common/PageHeader";
import PageTransition from "@/shared/components/common/PageTransition";
import VoucherAnalytics from "@/shared/components/pages/voucher-and-promo/VoucherAnalytics";
import VoucherTable from "@/shared/components/pages/voucher-and-promo/VoucherTable";

const VoucherAndPromoPage = () => {
  const { t } = useTranslation("voucher");
  return (
  <PageTransition>
    <PageHeader title={t("pageTitle")} description={t("pageDescription")} />
    <VoucherAnalytics />
    <VoucherTable />
  </PageTransition>
  );
};

export default VoucherAndPromoPage;
