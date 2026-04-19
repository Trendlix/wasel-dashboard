import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { DollarSign, Percent } from "lucide-react";
import AnalyticsCard, { AnalyticsCardSkeleton } from "../../common/AnalyticsCard";
import useCommissionStore from "@/shared/hooks/store/useCommissionStore";
import type { TCommissionCategory } from "@/shared/hooks/store/useCommissionStore";

const iconClasses = [
    "bg-main-primary/10! text-main-primary!",
    "bg-main-vividMint/10! text-main-vividMint!",
    "bg-main-mustardGold/10! text-main-mustardGold!",
];

const CommissionAnalytics = () => {
    const { t } = useTranslation("commission");
    const { analytics, analyticsLoading, fetchAnalytics } = useCommissionStore();

    useEffect(() => {
        fetchAnalytics();
    }, [fetchAnalytics]);

    if (analyticsLoading) {
        return (
            <div className="flex items-stretch *:flex-1 gap-6">
                {Array.from({ length: 3 }).map((_, i) => (
                    <AnalyticsCardSkeleton key={i} notColorfull={true} />
                ))}
            </div>
        );
    }

    const cards = analytics.map((item, index) => ({
        id: index + 1,
        title: t(`analytics.${item.category as TCommissionCategory}`),
        value: item.rate,
        icon: item.type === "fixed" ? DollarSign : Percent,
        classname: "bg-main-white border border-main-whiteMarble",
    }));

    return (
        <div className="flex items-stretch *:flex-1 gap-6">
            {cards.map((card) => (
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

export default CommissionAnalytics;
