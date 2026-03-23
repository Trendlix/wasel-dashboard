import clsx from "clsx";
import { MapPin } from "lucide-react";

const cards = [
    { id: 1, label: "Total Trips", value: "9,120", iconBg: "bg-main-primary/10", iconColor: "text-main-primary" },
    { id: 2, label: "Active Trips", value: "156", iconBg: "bg-main-vividMint/10", iconColor: "text-main-vividMint" },
    { id: 3, label: "Completed Today", value: "87", iconBg: "bg-main-ladyBlue/10", iconColor: "text-main-ladyBlue" },
    { id: 4, label: "Cancelled", value: "12", iconBg: "bg-main-mustardGold/10", iconColor: "text-main-mustardGold" },
];

const Analytics = () => {
    return (
        <div className="grid grid-cols-4 gap-4">
            {cards.map((card) => (
                <div key={card.id} className="bg-main-white border border-main-whiteMarble common-rounded p-6 flex items-center justify-between">
                    <div className="flex flex-col gap-1">
                        <span className="text-main-sharkGray text-sm">{card.label}</span>
                        <span className="text-main-mirage text-4xl font-bold">{card.value}</span>
                    </div>
                    <div className={clsx("w-11 h-11 rounded-xl flex items-center justify-center", card.iconBg, card.iconColor)}>
                        <MapPin size={20} />
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Analytics;