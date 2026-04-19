import clsx from "clsx";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { verificationAnalyticsConfig } from "@/shared/core/pages/verification";
import useVerificationStore from "@/shared/hooks/store/useVerificationStore";

const countKeyByTitleKey: Record<
  "pendingReviews" | "approved" | "rejected",
  "pending" | "approved" | "rejected"
> = {
  pendingReviews: "pending",
  approved: "approved",
  rejected: "rejected",
};

const Analytics = () => {
  const { t } = useTranslation("verification");
  const { counts, countsLoading, fetchVerificationCounts } = useVerificationStore();

  useEffect(() => {
    fetchVerificationCounts();
  }, []);

  if (countsLoading) {
    return (
      <div className="grid grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="bg-main-white border border-main-whiteMarble common-rounded p-4 flex items-center justify-between animate-pulse"
          >
            <div className="space-y-2">
              <div className="h-4 w-24 rounded bg-main-whiteMarble" />
              <div className="h-9 w-12 rounded bg-main-whiteMarble" />
            </div>
            <div className="w-10 h-10 rounded-lg bg-main-whiteMarble" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-4">
      {verificationAnalyticsConfig.map((card) => {
        const Icon = card.icon;
        const countKey = countKeyByTitleKey[card.titleKey];
        const value = String(counts[countKey]);
        return (
          <div key={card.id} className="bg-main-white border border-main-whiteMarble common-rounded p-4 flex items-center justify-between">
            <div>
              <p className="text-main-sharkGray text-sm">{t(`analytics.${card.titleKey}`)}</p>
              <p className="text-main-mirage text-4xl font-bold">{value}</p>
            </div>
            <div className={clsx("w-10 h-10 rounded-lg flex items-center justify-center", card.iconWrapper)}>
              <Icon size={18} />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Analytics;
