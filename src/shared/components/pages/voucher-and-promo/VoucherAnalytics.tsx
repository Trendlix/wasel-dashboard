import { useEffect } from "react";
import AnalyticsCard, { AnalyticsCardSkeleton } from "@/shared/components/common/AnalyticsCard";
import { voucherAnalyticsConfig } from "@/shared/core/pages/voucherAndPromo";
import useVoucherStore from "@/shared/hooks/store/useVoucherStore";

const VoucherAnalytics = () => {
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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
      {analyticsLoading
        ? Array.from({ length: 4 }).map((_, idx) => (
            <AnalyticsCardSkeleton key={idx} notColorfull />
          ))
        : voucherAnalyticsConfig.map((item) => {
            const value =
              item.id === 1
                ? values.active
                : item.id === 2
                  ? values.redemptions
                  : item.id === 3
                    ? values.expiringSoon
                    : values.total;

            return (
              <AnalyticsCard
                key={item.id}
                {...item}
                value={value.toLocaleString()}
              />
            );
          })}
    </div>
  );
};

export default VoucherAnalytics;
