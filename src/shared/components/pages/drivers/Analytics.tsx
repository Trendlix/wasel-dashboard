import { Clock, DollarSign, Truck } from "lucide-react";
import clsx from "clsx";

const cards = [
    { id: 1, label: "Total Drivers", value: "892", icon: <Truck size={22} />, iconBg: "bg-main-primary/10", iconColor: "text-main-primary" },
    { id: 2, label: "Active Drivers", value: "756", icon: <Truck size={22} />, iconBg: "bg-main-vividMint/10", iconColor: "text-main-vividMint" },
    { id: 3, label: "Pending Approval", value: "28", icon: <Clock size={22} />, iconBg: "bg-main-mustardGold/10", iconColor: "text-main-mustardGold" },
    { id: 4, label: "Total Earnings", value: "EGP 2.4M", icon: <DollarSign size={22} />, iconBg: "bg-main-ladyBlue/10", iconColor: "text-main-ladyBlue" },
];

const Analytics = () => {
    return (
        <div className="grid grid-cols-4 gap-4">
            {cards.map((card) => (
                <div key={card.id} className="bg-main-white border border-main-whiteMarble common-rounded p-5 flex items-center justify-between">
                    <div className="flex flex-col gap-1">
                        <span className="text-main-sharkGray text-sm font-normal">{card.label}</span>
                        <span className="text-main-mirage text-2xl font-bold">{card.value}</span>
                    </div>
                    <div className={clsx("w-11 h-11 rounded-xl flex items-center justify-center", card.iconBg, card.iconColor)}>
                        {card.icon}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Analytics;