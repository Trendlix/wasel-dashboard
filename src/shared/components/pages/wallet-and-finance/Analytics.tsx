import clsx from "clsx";
import { DollarSign, TrendingUp } from "lucide-react";

const cards = [
    { id: 1, label: "Total Platform Revenue", value: "EGP 328K", sub: "↑ 12.5%", iconBg: "bg-main-vividMint/10", iconColor: "text-main-vividMint", icon: <DollarSign size={20} /> },
    { id: 2, label: "Total Payouts", value: "EGP 245K", iconBg: "bg-main-primary/10", iconColor: "text-main-primary", icon: <TrendingUp size={20} /> },
    { id: 3, label: "Commission Earnings", value: "EGP 83K", iconBg: "bg-main-ladyBlue/10", iconColor: "text-main-ladyBlue", icon: <DollarSign size={20} /> },
];

const Analytics = () => {
    return (
        <div className="grid grid-cols-3 gap-4">
            {cards.map((card) => (
                <div key={card.id} className="bg-main-white border border-main-whiteMarble common-rounded p-4 flex items-center justify-between">
                    <div>
                        <p className="text-main-sharkGray text-sm">{card.label}</p>
                        <p className="text-main-mirage text-4xl font-bold">{card.value}</p>
                        {card.sub ? <p className="text-main-vividMint text-xs mt-1">{card.sub}</p> : null}
                    </div>
                    <div className={clsx("w-10 h-10 rounded-lg flex items-center justify-center", card.iconBg, card.iconColor)}>
                        {card.icon}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Analytics;