import AnalyticsCard, { AnalyticsCardSkeleton, IAnalyticsCard } from "../../common/AnalyticsCard";
import useUserManagementStore from "@/shared/hooks/store/useUserManagementStore";
import { useEffect, useState } from "react";
import { Shield, Users } from "lucide-react";

const iconClasses = [
    "bg-main-primary/10! text-main-primary!",
    "bg-main-vividMint/10! text-main-vividMint!",
    "bg-main-primary/10! text-main-primary!",
    "bg-main-mustardGold/10! text-main-mustardGold!",
];

const RolesAnalytics = () => {
    const { stats, fetchStats, loadingStats } = useUserManagementStore();
    const [arrangedAnalytics, setArrangedAnalytics] = useState<IAnalyticsCard[]>([]);

    useEffect(() => {
        fetchStats();
    }, [fetchStats]);

    useEffect(() => {
        if (stats) {
            setArrangedAnalytics([
                {
                    id: 1,
                    title: "Total Roles",
                    value: stats.total_roles.toString(),
                    icon: Shield,
                    classname: "bg-main-white border border-main-whiteMarble",
                },
                {
                    id: 2,
                    title: "Active Users",
                    value: stats.active_admins.toString(),
                    icon: Users,
                    classname: "bg-main-white border border-main-whiteMarble",
                },
                {
                    id: 3,
                    title: "2FA Enabled",
                    value: stats.enabled_2fa.toString(),
                    description: `${(stats.enabled_2fa / stats.total_admins * 100).toFixed(0)}% of admins`,
                    icon: Shield,
                    classname: "bg-main-white border border-main-whiteMarble",
                },
                {
                    id: 4,
                    title: "Total Users",
                    value: stats.total_admins.toString(),
                    icon: Users,
                    classname: "bg-main-white border border-main-whiteMarble",
                },
            ]);
        }
    }, [stats]);
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
