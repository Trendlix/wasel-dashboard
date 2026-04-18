import { usersAnalyticsConfig } from "../../../core/pages/users";
import AnalyticsCard, { AnalyticsCardSkeleton } from "../../common/AnalyticsCard";
import useUserStore from "@/shared/hooks/store/useUserStore";
import { useEffect } from "react";

const iconClasses = [
    "bg-main-primary/10! text-main-primary!",
    "bg-main-vividMint/10! text-main-vividMint!",
    "bg-main-mustardGold/10! text-main-mustardGold!",
];

const Analytics = () => {
    const { meta, loading, analytics, analyticsLoading, fetchUsersAnalytics } = useUserStore();

    useEffect(() => {
        fetchUsersAnalytics();
    }, []);

    const values = [
        analytics ? String(analytics.total_users) : (meta ? String(meta.total) : "—"),
        analytics ? String(analytics.active_users) : "—",
        analytics ? String(analytics.blocked_users) : "—",
    ];

    if ((loading && !meta) || (analyticsLoading && !analytics)) {
        return (
            <div className="flex items-center *:flex-1 gap-6">
                {usersAnalyticsConfig.map((c) => (
                    <AnalyticsCardSkeleton key={c.id} notColorfull />
                ))}
            </div>
        );
    }

    return (
        <div className="flex items-center *:flex-1 gap-6">
            {usersAnalyticsConfig.map((card, i) => (
                <AnalyticsCard
                    key={card.id}
                    {...card}
                    value={values[i]}
                    iconClass={iconClasses[i]}
                    notColorfull
                />
            ))}
        </div>
    );
};

export default Analytics;
