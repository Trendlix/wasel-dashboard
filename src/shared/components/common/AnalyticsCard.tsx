import clsx from "clsx";
import type { LucideIcon } from "lucide-react";

export interface IAnalyticsCard {
    id: number;
    title: string;
    value: string;
    description?: string;
    icon: LucideIcon;
    classname?: string;
    iconClass?: string;
    notColorfull?: boolean;
}

export const AnalyticsCardSkeleton: React.FC<{ notColorfull?: boolean }> = ({ notColorfull }) => {
    const skeletonBg = notColorfull ? "bg-main-sharkGray/30" : "bg-main-whiteMarble";

    return (
        <div className={clsx(
            "p-6 space-y-2 common-rounded animate-pulse",
            notColorfull ? "bg-main-luxuryWhite border border-main-whiteMarble" : "bg-main-black/10"
        )}>
            <div className="flex items-start justify-between gap-3">
                <div className="space-y-2 flex-1">
                    <div className={clsx("h-4 rounded w-24", skeletonBg)} />
                    <div className={clsx("h-9 rounded w-32", skeletonBg)} />
                </div>
                <div className={clsx("common-rounded p-3 w-12 h-12 shrink-0", skeletonBg)} />
            </div>
            <div className={clsx("h-3 rounded w-full", skeletonBg)} />
        </div>
    );
};

const AnalyticsCard: React.FC<IAnalyticsCard> = ({
    title,
    value,
    description,
    icon: Icon,
    classname,
    iconClass,
    notColorfull,
}) => {
    return (
        <div className={clsx(
            "p-6",
            "text-main-white font-medium text-sm leading-[20px]",
            "space-y-2",
            "common-rounded",
            classname
        )}>
            <div className="flex items-start justify-between gap-3">
                <div>
                    <p className={clsx("capitalize", notColorfull && "text-main-sharkGray")}>
                        {title}
                    </p>
                    <p className={clsx(
                        "font-bold text-3xl leading-[36px]",
                        notColorfull && "text-main-mirage"
                    )}>
                        {value}
                    </p>
                </div>
                <div className={clsx(
                    "common-rounded p-3 text-main-white bg-main-black/10",
                    iconClass
                )}>
                    <Icon className="w-6 h-6" />
                </div>
            </div>
            {description && (
                <div className={clsx(notColorfull && "text-main-sharkGray")}>
                    {description}
                </div>
            )}
        </div>
    );
};

export default AnalyticsCard;