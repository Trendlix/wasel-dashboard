import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import AnalyticsCard, { AnalyticsCardSkeleton, IAnalyticsCard } from "../../common/AnalyticsCard";
import useUserManagementStore from "@/shared/hooks/store/useUserManagementStore";
import { Shield, Users } from "lucide-react";

const iconClasses = [
    "bg-main-primary/10! text-main-primary!",
    "bg-main-vividMint/10! text-main-vividMint!",
    "bg-main-primary/10! text-main-primary!",
    "bg-main-mustardGold/10! text-main-mustardGold!",
];

const RolesAnalytics = () => {
    const { t } = useTranslation("roles");
    const { stats, fetchStats, loadingStats } = useUserManagementStore();

    useEffect(() => {
        fetchStats();
    }, [fetchStats]);

    const twoFaDescription = useMemo(() => {
        if (!stats || stats.total_admins <= 0) return undefined;
        const percent = ((stats.enabled_2fa / stats.total_admins) * 100).toFixed(0);
        return t("analytics.twoFaPercentDescription", { percent });
    }, [stats, t]);

    const arrangedAnalytics = useMemo((): IAnalyticsCard[] => {
        if (!stats) return [];
        return [
            {
                id: 1,
                title: t("analytics.totalRoles"),
                value: stats.total_roles.toString(),
                icon: Shield,
                classname: "bg-main-white border border-main-whiteMarble",
            },
            {
                id: 2,
                title: t("analytics.activeUsers"),
                value: stats.active_admins.toString(),
                icon: Users,
                classname: "bg-main-white border border-main-whiteMarble",
            },
            {
                id: 3,
                title: t("analytics.twoFaEnabled"),
                value: stats.enabled_2fa.toString(),
                description: twoFaDescription,
                icon: Shield,
                classname: "bg-main-white border border-main-whiteMarble",
            },
            {
                id: 4,
                title: t("analytics.totalUsers"),
                value: stats.total_admins.toString(),
                icon: Users,
                classname: "bg-main-white border border-main-whiteMarble",
            },
        ];
    }, [stats, t, twoFaDescription]);

    if (loadingStats) {
        return (
            <div className="flex items-stretch *:flex-1 gap-6">
                <AnalyticsCardSkeleton notColorfull={true} />
                <AnalyticsCardSkeleton notColorfull={true} />
                <AnalyticsCardSkeleton notColorfull={true} />
                <AnalyticsCardSkeleton notColorfull={true} />
            </div>
        );
    }
    return (
        <div className="flex items-stretch *:flex-1 gap-6">
            {arrangedAnalytics.map((card) => (
                <AnalyticsCard
                    key={card.id}
                    {...card}
                    iconClass={iconClasses[card.id - 1]}
                    notColorfull={true}
                />
            ))}
        </div>
    );
};

export default RolesAnalytics;
