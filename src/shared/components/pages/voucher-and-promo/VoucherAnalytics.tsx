import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import AnalyticsCard, { AnalyticsCardSkeleton } from "@/shared/components/common/AnalyticsCard";
import { voucherAnalyticsConfig } from "@/shared/core/pages/voucherAndPromo";
import useVoucherStore from "@/shared/hooks/store/useVoucherStore";

const VoucherAnalytics = () => {
  const { t } = useTranslation("voucher");
  const { analytics, analyticsLoading, fetchVouchersAnalytics } = useVoucherStore();

  useEffect(() => {
    fetchVouchersAnalytics();
  }, [fetchVouchersAnalytics]);

  const values = {
    active: analytics?.active_vouchers ?? 0,
    redemptions: analytics?.total_redemptions ?? 0,
    expiringSoon: analytics?.expiring_soon ?? 0,
    total: analytics?.total_vouchers ?? 0,
  };

  const valueFor = (key: (typeof voucherAnalyticsConfig)[number]["valueKey"]) => {
    switch (key) {
      case "active":
        return values.active;
      case "redemptions":
        return values.redemptions;
      case "expiringSoon":
        return values.expiringSoon;
      case "total":
        return values.total;
      default:
        return 0;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
      {analyticsLoading
        ? Array.from({ length: 4 }).map((_, idx) => (
            <AnalyticsCardSkeleton key={idx} notColorfull />
          ))
        : voucherAnalyticsConfig.map((item) => (
            <AnalyticsCard
              key={item.id}
              id={item.id}
              title={t(`analytics.${item.titleKey}`)}
              description={t(`analytics.${item.descKey}`)}
              value={valueFor(item.valueKey).toLocaleString()}
              icon={item.icon}
              classname={item.classname}
            />
          ))}
    </div>
  );
};

export default VoucherAnalytics;
