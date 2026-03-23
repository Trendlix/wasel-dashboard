import clsx from "clsx";
import { DollarSign, Truck, TrendingUp, Users } from "lucide-react";
import { analyticsCards } from "@/shared/core/pages/analytics";

const iconMap = {
    dollar: DollarSign,
    trend: TrendingUp,
    users: Users,
    truck: Truck,
};

const iconStyles = {
    dollar: "bg-main-vividMint/10 text-main-vividMint",
    trend: "bg-main-primary/10 text-main-primary",
    users: "bg-main-ladyBlue/10 text-main-ladyBlue",
    truck: "bg-main-mustardGold/10 text-main-mustardGold",
};

const AnalyticsCards = () => {
    return (
        <div className="grid grid-cols-4 gap-4">
            {analyticsCards.map((card) => {
                const Icon = iconMap[card.icon as keyof typeof iconMap];
                return (
                    <div key={card.id} className="bg-main-white border border-main-whiteMarble common-rounded p-4 flex items-center justify-between">
                        <div>
                            <p className="text-main-sharkGray text-sm">{card.title}</p>
                            <p className="text-main-mirage text-4xl font-bold">{card.value}</p>
                        </div>
                        <div className={clsx("w-10 h-10 rounded-lg flex items-center justify-center", iconStyles[card.icon as keyof typeof iconStyles])}>
                            <Icon size={18} />
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default AnalyticsCards;