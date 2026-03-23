import clsx from "clsx";
import { Warehouse } from "lucide-react";

const cards = [
    { id: 1, label: "Total Storage Facilities", value: "48", iconBg: "bg-main-primary/10", iconColor: "text-main-primary" },
    { id: 2, label: "Active Facilities", value: "42", iconBg: "bg-main-vividMint/10", iconColor: "text-main-vividMint" },
    { id: 3, label: "Pending Approval", value: "6", iconBg: "bg-main-mustardGold/10", iconColor: "text-main-mustardGold" },
];

const Analytics = () => {
    return (
        <div className="grid grid-cols-3 gap-4">
            {cards.map((card) => (
                <div key={card.id} className="bg-main-white border border-main-whiteMarble common-rounded p-6 flex items-center justify-between">
                    <div className="flex flex-col gap-1">
                        <span className="text-main-sharkGray text-sm">{card.label}</span>
                        <span className="text-main-mirage text-4xl font-bold">{card.value}</span>
                    </div>
                    <div className={clsx("w-14 h-14 rounded-xl flex items-center justify-center", card.iconBg, card.iconColor)}>
                        <Warehouse size={26} />
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Analytics;