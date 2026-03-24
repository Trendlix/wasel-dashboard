import { commissionAnalytics } from "@/shared/core/pages/commissionAndPricing";
import AnalyticsCard from "../../common/AnalyticsCard";

const iconClasses = [
    "bg-main-primary/10! text-main-primary!",
    "bg-main-vividMint/10! text-main-vividMint!",
    "bg-main-mustardGold/10! text-main-mustardGold!",
];

const CommissionAnalytics = () => (
    <div className="flex items-stretch *:flex-1 gap-6">
        {commissionAnalytics.map((card) => (
            <AnalyticsCard
                key={card.id}
                {...card}
                iconClass={iconClasses[card.id - 1]}
                notColorfull={true}
            />
        ))}
    </div>
);

export default CommissionAnalytics;
