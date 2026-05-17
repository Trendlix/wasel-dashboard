import { useTranslation } from "react-i18next";
import AnalyticsCard, { AnalyticsCardSkeleton } from "../../../common/AnalyticsCard";
import useTruckRequestsStore from "@/shared/hooks/store/useTruckRequestsStore";
import { requestsAnalyticsConfig } from "@/shared/core/pages/requests";

const iconClasses = [
  "bg-main-mustardGold/10! text-main-mustardGold!",
  "bg-main-sharkGray/10! text-main-sharkGray!",
  "bg-main-vividMint/10! text-main-vividMint!",
  "bg-main-remove/10! text-main-remove!",
];

const toSafeNumber = (value: unknown, fallback = 0) =>
  typeof value === "number" && Number.isFinite(value) ? value : fallback;

const RequestsAnalytics = () => {
  const { t } = useTranslation("trips");
  const { analytics, analyticsLoading } = useTruckRequestsStore();

  if (analyticsLoading && !analytics) {
    return (
      <div className="grid grid-cols-4 gap-4">
        {requestsAnalyticsConfig.map((card) => (
          <AnalyticsCardSkeleton key={card.id} notColorfull />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-4 gap-4">
      {requestsAnalyticsConfig.map((card, i) => (
        <AnalyticsCard
          key={card.id}
          id={card.id}
          title={t(`requestsAnalytics.${card.titleKey}`)}
          value={String(toSafeNumber(analytics?.[card.titleKey]))}
          icon={card.icon}
          classname={card.classname}
          iconClass={iconClasses[i]}
          notColorfull
        />
      ))}
    </div>
  );
};

export default RequestsAnalytics;
