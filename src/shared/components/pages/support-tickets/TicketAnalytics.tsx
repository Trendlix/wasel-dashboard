import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { CheckCircle, Clock, MessageSquare, TicketCheck, XCircle } from "lucide-react";
import AnalyticsCard, { AnalyticsCardSkeleton } from "../../common/AnalyticsCard";
import useTicketStore from "@/shared/hooks/store/useTicketStore";

const TicketAnalytics = () => {
    const { t } = useTranslation("support");
    const { stats, statsLoading, fetchStats } = useTicketStore();

    useEffect(() => { fetchStats(); }, []);

    const cards = useMemo(
        () => [
            { id: 1, titleKey: "analytics.total" as const, valueKey: "total" as const, icon: TicketCheck, classname: "bg-main-primary" },
            { id: 2, titleKey: "analytics.open" as const, valueKey: "pending" as const, icon: Clock, classname: "bg-main-vividMint" },
            { id: 3, titleKey: "analytics.pendingReply" as const, valueKey: "reply" as const, icon: MessageSquare, classname: "bg-main-mustardGold" },
            { id: 4, titleKey: "analytics.closed" as const, valueKey: "closed" as const, icon: XCircle, classname: "bg-main-sharkGray" },
            { id: 5, titleKey: "analytics.solved" as const, valueKey: "solved" as const, icon: CheckCircle, classname: "bg-main-vividSubmarine" },
        ],
        [],
    );

    if (statsLoading || !stats) {
        return (
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                {Array.from({ length: 5 }).map((_, i) => (
                    <AnalyticsCardSkeleton key={i} />
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            {cards.map((c) => (
                <AnalyticsCard
                    key={c.id}
                    id={c.id}
                    title={t(c.titleKey)}
                    value={String(stats[c.valueKey])}
                    icon={c.icon}
                    classname={c.classname}
                />
            ))}
        </div>
    );
};

export default TicketAnalytics;
