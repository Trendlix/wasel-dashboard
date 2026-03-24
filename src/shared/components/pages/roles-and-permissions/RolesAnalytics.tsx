import { rolesAnalytics } from "@/shared/core/pages/rolesAndPermissions";
import AnalyticsCard from "../../common/AnalyticsCard";

const iconClasses = [
    "bg-main-primary/10! text-main-primary!",
    "bg-main-vividMint/10! text-main-vividMint!",
    "bg-main-primary/10! text-main-primary!",
    "bg-main-mustardGold/10! text-main-mustardGold!",
];

const RolesAnalytics = () => {
    return (
        <div className="flex items-stretch *:flex-1 gap-6">
            {rolesAnalytics.map((card) => (
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
