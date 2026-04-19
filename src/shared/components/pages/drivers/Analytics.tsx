import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { driversAnalyticsConfig } from "../../../core/pages/drivers";
import AnalyticsCard, { AnalyticsCardSkeleton } from "../../common/AnalyticsCard";
import useDriverStore from "@/shared/hooks/store/useDriverStore";

const iconClasses = [
    "bg-main-primary/10! text-main-primary!",
    "bg-main-vividMint/10! text-main-vividMint!",
    "bg-main-mustardGold/10! text-main-mustardGold!",
];

const Analytics = () => {
    const { t } = useTranslation("drivers");
    const { meta, loading, analytics, analyticsLoading, fetchDriversAnalytics } = useDriverStore();

    useEffect(() => {
        fetchDriversAnalytics();
    }, []);

    const values = [
        analytics ? String(analytics.total_drivers) : (meta ? String(meta.total) : "—"),
        analytics ? String(analytics.approved_drivers) : "—",
        analytics ? String(analytics.pending_drivers) : "—",
    ];

    if ((loading && !meta) || (analyticsLoading && !analytics)) {
        return (
            <div className="flex items-center *:flex-1 gap-6">
                {driversAnalyticsConfig.map((c) => (
                    <AnalyticsCardSkeleton key={c.id} notColorfull />
                ))}
            </div>
        );
    }

    return (
        <div className="flex items-center *:flex-1 gap-6">
            {driversAnalyticsConfig.map((card, i) => (
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
