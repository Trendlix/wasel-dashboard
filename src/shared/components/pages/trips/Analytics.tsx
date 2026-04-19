import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import AnalyticsCard, { AnalyticsCardSkeleton } from "../../common/AnalyticsCard";
import useTripsStore from "@/shared/hooks/store/useTripsStore";
import { tripsAnalyticsConfig } from "@/shared/core/pages/trips";

const iconClasses = [
  "bg-main-primary/10! text-main-primary!",
  "bg-main-ladyBlue/10! text-main-ladyBlue!",
  "bg-main-vividMint/10! text-main-vividMint!",
  "bg-main-remove/10! text-main-remove!",
];

const toSafeNumber = (value: unknown, fallback = 0) =>
  typeof value === "number" && Number.isFinite(value) ? value : fallback;

const Analytics = () => {
  const { t } = useTranslation("trips");
  const { analytics, analyticsLoading, fetchTripsAnalytics } = useTripsStore();

  useEffect(() => {
    fetchTripsAnalytics();
  }, []);

  const values = [
    String(toSafeNumber(analytics?.total?.totalTrips)),
    String(toSafeNumber(analytics?.total?.activeTrips)),
    String(toSafeNumber(analytics?.total?.completedTrips)),
    String(toSafeNumber(analytics?.total?.canclledTrips)),
  ];

  if (analyticsLoading && !analytics) {
    return (
      <div className="grid grid-cols-4 gap-4">
        {tripsAnalyticsConfig.map((card) => (
          <AnalyticsCardSkeleton key={card.id} notColorfull />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-4 gap-4">
      {tripsAnalyticsConfig.map((card, i) => (
        <AnalyticsCard
          key={card.id}
          id={card.id}
          title={t(`analytics.${card.titleKey}`)}
          value={values[i]}
          icon={card.icon}
          classname={card.classname}
          iconClass={iconClasses[i]}
          notColorfull
        />
      ))}
    </div>
  );
};

export default Analytics;
