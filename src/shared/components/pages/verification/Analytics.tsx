import clsx from "clsx";
import { CheckCircle2, FileText, XCircle } from "lucide-react";

const cards = [
    { id: 1, label: "Pending Reviews", value: "3", icon: FileText, iconBg: "bg-main-mustardGold/10", iconColor: "text-main-mustardGold" },
    { id: 2, label: "Approved", value: "2", icon: CheckCircle2, iconBg: "bg-main-vividMint/10", iconColor: "text-main-vividMint" },
    { id: 3, label: "Rejected", value: "1", icon: XCircle, iconBg: "bg-main-primary/10", iconColor: "text-main-primary" },
];

const Analytics = () => {
    return (
        <div className="grid grid-cols-3 gap-4">
            {cards.map((card) => {
                const Icon = card.icon;
                return (
                    <div key={card.id} className="bg-main-white border border-main-whiteMarble common-rounded p-4 flex items-center justify-between">
                        <div>
                            <p className="text-main-sharkGray text-sm">{card.label}</p>
                            <p className="text-main-mirage text-4xl font-bold">{card.value}</p>
                        </div>
                        <div className={clsx("w-10 h-10 rounded-lg flex items-center justify-center", card.iconBg, card.iconColor)}>
                            <Icon size={18} />
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default Analytics;